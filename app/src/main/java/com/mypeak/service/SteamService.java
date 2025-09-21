package com.mypeak.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mypeak.dto.AddGameRequest;
import com.mypeak.entity.Game;
import com.mypeak.entity.Review;
import com.mypeak.entity.User;
import com.mypeak.repository.GameRepository;
import com.mypeak.repository.ReviewRepository;
import com.mypeak.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class SteamService {
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private GameService gameService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Value("${app.public.url}")
    private String publicUrl;
    @Value("${steam.api.key}")
    private String apiKey;
    private static final ConcurrentHashMap<String, Long> stateMap = new ConcurrentHashMap<>();

    public void searchAndAddIfNotExist(String query) {
        String searchUrl = "https://store.steampowered.com/api/storesearch/?term=" + query + "&cc=US&l=english";
        String response = restTemplate.getForObject(searchUrl, String.class);
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode items = root.path("items");
            Set<String> addedTitles = new HashSet<>();
            if (items.isArray()) {
                for (JsonNode item : items) {
                    String title = item.path("name").asText();
                    if (title.toLowerCase().contains(query.toLowerCase()) && !addedTitles.contains(title)) {
                        if (gameRepository.existsByTitle(title)) continue;
                        long appId = item.path("id").asLong();
                        String detailsUrl = "https://store.steampowered.com/api/appdetails?appids=" + appId;
                        String detailsResponse = restTemplate.getForObject(detailsUrl, String.class);
                        JsonNode detailsRoot = objectMapper.readTree(detailsResponse);
                        JsonNode gameData = detailsRoot.path(String.valueOf(appId)).path("data");
                        AddGameRequest request = new AddGameRequest();
                        request.setTitle(title);
                        request.setDescription(gameData.path("short_description").asText());
                        request.setDeveloper(gameData.path("developers").get(0).asText());
                        String releaseDateStr = gameData.path("release_date").path("date").asText();
                        LocalDate releaseDate = parseReleaseDate(releaseDateStr);
                        request.setReleaseDate(releaseDate);
                        request.setImage(gameData.path("header_image").asText());
                        request.setGenre(gameData.path("genres").get(0).path("description").asText());
                        request.setSteamAppId(appId);
                        List<String> platforms = new ArrayList<>();
                        JsonNode platformsNode = gameData.path("platforms");
                        if (platformsNode.path("windows").asBoolean()) platforms.add("PC");
                        if (platformsNode.path("mac").asBoolean()) platforms.add("Mac");
                        if (platformsNode.path("linux").asBoolean()) platforms.add("Linux");
                        request.setPlatforms(platforms);
                        gameService.addGame(request);
                        addedTitles.add(title);
                    }
                }
            }
        } catch (Exception e) {
            // Log error
        }
    }

    private LocalDate parseReleaseDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty() || dateStr.equalsIgnoreCase("coming soon")) {
            return null;
        }
        List<DateTimeFormatter> formatters = Arrays.asList(
                DateTimeFormatter.ofPattern("d MMM, yyyy").withLocale(Locale.ENGLISH),
                DateTimeFormatter.ofPattern("MMM d, yyyy").withLocale(Locale.ENGLISH),
                DateTimeFormatter.ofPattern("yyyy")
        );
        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalDate.parse(dateStr, formatter);
            } catch (DateTimeParseException e) {
                // Try next
            }
        }
        return null; // If cannot parse
    }

    public String getAuthUrl(Long userId) {
        String state = UUID.randomUUID().toString();
        stateMap.put(state, userId);
        String openIdUrl = "https://steamcommunity.com/openid/login";
        String returnTo = publicUrl + "/api/steam/callback?state=" + state;
        Map<String, String> params = new HashMap<>();
        params.put("openid.ns", "http://specs.openid.net/auth/2.0");
        params.put("openid.mode", "checkid_setup");
        params.put("openid.return_to", returnTo);
        params.put("openid.realm", publicUrl);
        params.put("openid.identity", "http://specs.openid.net/auth/2.0/identifier_select");
        params.put("openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select");
        try {
            String query = params.entrySet().stream()
                    .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                    .collect(Collectors.joining("&"));
            return openIdUrl + "?" + query;
        } catch (Exception e) {
            throw new RuntimeException("Failed to build auth URL");
        }
    }

    public String handleCallback(Map<String, String> params) {
        String state = params.get("state");
        if (state == null) {
            return publicUrl + "/error";
        }
        Long userId = stateMap.remove(state);
        if (userId == null) return publicUrl + "/error";
        String claimedId = params.get("openid.claimed_id");
        if (claimedId == null || !claimedId.startsWith("https://steamcommunity.com/openid/id/")) return publicUrl + "/error";
        Map<String, String> valParams = new HashMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (entry.getKey().startsWith("openid.")) {
                valParams.put(entry.getKey(), entry.getValue());
            }
        }
        valParams.put("openid.mode", "check_authentication");
        try {
            String valBody = valParams.entrySet().stream()
                    .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                    .collect(Collectors.joining("&"));
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<String> entity = new HttpEntity<>(valBody, headers);
            String valResponse = restTemplate.postForObject("https://steamcommunity.com/openid/login", entity, String.class);
            if (valResponse == null || !valResponse.contains("is_valid:true")) return publicUrl + "/error";
        } catch (Exception e) {
            return publicUrl + "/error";
        }
        String steamId = claimedId.replace("https://steamcommunity.com/openid/id/", "");
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setSteamId(steamId);
            userRepository.save(user);
            List<Review> userReviews = reviewRepository.findByUserId(user.getId());
            for (Review review : userReviews) {
                if ("PC".equals(review.getPlatform()) && review.getGame().getSteamAppId() != null) {
                    boolean owns = userOwnsGame(steamId, review.getGame().getSteamAppId());
                    if (owns != review.getVerified()) {
                        review.setVerified(owns);
                        reviewRepository.save(review);
                    }
                }
            }
        }
        return publicUrl;
    }

    public boolean userOwnsGame(String steamId, Long appId) {
        if (steamId == null || appId == null) return false;
        String url = String.format("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=%s&steamid=%s&format=json", apiKey, steamId);
        try {
            JsonNode root = objectMapper.readTree(restTemplate.getForObject(url, String.class));
            JsonNode games = root.path("response").path("games");
            if (games.isArray()) {
                for (JsonNode game : games) {
                    if (game.path("appid").asLong() == appId) return true;
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isGameReleased(Long appId) {
        if (appId == null) return true;
        String url = "https://store.steampowered.com/api/appdetails?appids=" + appId;
        try {
            JsonNode root = objectMapper.readTree(restTemplate.getForObject(url, String.class));
            JsonNode gameData = root.path(appId.toString()).path("data");
            return !gameData.path("release_date").path("coming_soon").asBoolean(true);
        } catch (Exception e) {
            return false;
        }
    }

    public void disconnect(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setSteamId(null);
        userRepository.save(user);
        List<Review> userReviews = reviewRepository.findByUserId(userId);
        for (Review review : userReviews) {
            if (review.getVerified()) {
                review.setVerified(false);
                reviewRepository.save(review);
            }
        }
    }
}