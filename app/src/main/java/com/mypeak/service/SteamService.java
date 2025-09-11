package com.mypeak.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mypeak.dto.AddGameRequest;
import com.mypeak.entity.Game;
import com.mypeak.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class SteamService {
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private GameService gameService;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

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
                        String releaseDate = gameData.path("release_date").path("date").asText();
                        request.setReleaseYear(releaseDate.isEmpty() ? null : Integer.parseInt(releaseDate.split(" ")[2]));
                        request.setImage("https://cdn.akamai.steamstatic.com/steam/apps/" + appId + "/header.jpg");
                        request.setGenre(gameData.path("genres").get(0).path("description").asText());

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
}