package com.mypeak.config;
import com.mypeak.entity.User;
import com.mypeak.repository.UserRepository;
import com.mypeak.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import org.springframework.transaction.annotation.Transactional;
import java.util.Base64;
import io.jsonwebtoken.security.Keys;
@CrossOrigin(origins = "${app.allowed.origin}")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Value("${telegram.bot.token}")
    private String botToken;
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private long jwtExpirationMs;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ObjectMapper objectMapper;
    @Transactional
    @PostMapping("/telegram")
    public Map<String, Object> authTelegram(@RequestBody Map<String, String> body) {
        String initData = body.get("initData");
        if (validateInitData(initData)) {
            Map<String, String> data = parseInitData(initData);
            Long tgId = Long.parseLong(data.get("user_id"));
            User user = userService.findByTelegramId(tgId).orElseGet(() -> {
                User newUser = new User();
                newUser.setTelegramId(tgId);
                newUser.setName(data.getOrDefault("username", "TG User"));
                newUser.setAvatar(data.getOrDefault("photo_url", ""));
                try {
                    return userRepository.save(newUser);
                } catch (Exception e) {
                    return userService.findByTelegramId(tgId).orElseThrow(() -> new RuntimeException("User creation failed"));
                }
            });
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            String jwt = Jwts.builder()
                    .setSubject(user.getId().toString())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                    .signWith(Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecret)))
                    .compact();
            response.put("token", jwt);
            return response;
        }
        throw new RuntimeException("Invalid initData");
    }
    private boolean validateInitData(String initData) {
        try {
            String[] pairs = initData.split("&");
            String hash = null;
            String[] dataCheck = Arrays.stream(pairs)
                    .filter(p -> !p.startsWith("hash="))
                    .map(p -> {
                        String[] kv = p.split("=", 2);
                        if (kv.length == 2) {
                            try {
                                return kv[0] + "=" + java.net.URLDecoder.decode(kv[1], StandardCharsets.UTF_8);
                            } catch (Exception e) {
                                return p;
                            }
                        }
                        return p;
                    })
                    .sorted()
                    .toArray(String[]::new);
            String dataCheckString = String.join("\n", dataCheck);
            byte[] secretKey = computeHmac(botToken.getBytes(StandardCharsets.UTF_8), "WebAppData".getBytes(StandardCharsets.UTF_8));
            byte[] computedHashBytes = computeHmac(dataCheckString.getBytes(StandardCharsets.UTF_8), secretKey);
            String computedHash = bytesToHex(computedHashBytes);
            for (String p : pairs) {
                if (p.startsWith("hash=")) hash = p.substring(5);
            }
            if (!computedHash.equals(hash)) {
                return false;
            }
            // Check auth_date to prevent replay
            Map<String, String> dataMap = parseInitData(initData);
            long authDate = Long.parseLong(dataMap.get("auth_date"));
            long currentTime = System.currentTimeMillis() / 1000;
            if (currentTime - authDate > 86400) { // 24 hours
                return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    private byte[] computeHmac(byte[] data, byte[] key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(key, "HmacSHA256"));
        return mac.doFinal(data);
    }
    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) sb.append(String.format("%02x", b));
        return sb.toString();
    }
    private Map<String, String> parseInitData(String initData) {
        Map<String, String> map = new HashMap<>();
        for (String pair : initData.split("&")) {
            String[] kv = pair.split("=", 2);
            if (kv.length == 2) {
                String value = java.net.URLDecoder.decode(kv[1], StandardCharsets.UTF_8);
                map.put(kv[0], value);
            }
        }
        String userJson = map.get("user");
        if (userJson != null) {
            try {
                JsonNode userNode = objectMapper.readTree(userJson);
                map.put("user_id", String.valueOf(userNode.path("id").asLong()));
                map.put("username", userNode.path("username").asText());
                map.put("photo_url", userNode.path("photo_url").asText());
            } catch (Exception e) {
                // Ignore parse error
            }
        }
        return map;
    }
}