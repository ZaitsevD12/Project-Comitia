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

@CrossOrigin(origins = "*") // Для теста
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Value("${telegram.bot.token}")
    private String botToken;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/telegram")
    public Map<String, Object> authTelegram(@RequestBody Map<String, String> body) {
        String initData = body.get("initData");
        if (validateInitData(initData)) {
            Map<String, String> data = parseInitData(initData);
            Long tgId = Long.parseLong(data.get("user_id"));
            // Найти или создать пользователя
            User user = userService.findByTelegramId(tgId).orElseGet(() -> {
                User newUser = new User();
                newUser.setTelegramId(tgId);
                newUser.setName(data.getOrDefault("username", "TG User"));
                newUser.setAvatar(data.getOrDefault("photo_url", ""));
                try {
                    return userRepository.save(newUser);
                } catch (JpaSystemException e) {
                    return userService.findByTelegramId(tgId).orElseThrow(() -> new RuntimeException("User creation failed"));
                }
            });
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            // TODO: Генерировать JWT или сессию если нужно
            return response;
        }
        throw new RuntimeException("Invalid initData");
    }

    private boolean validateInitData(String initData) {
        try {
            String[] pairs = initData.split("&");
            System.out.println("Pairs: " + Arrays.toString(pairs));
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
            System.out.println("DataCheckString: " + dataCheckString);
            System.out.println("Computed Hash: " + computedHash);
            System.out.println("Received Hash: " + hash);
            return computedHash.equals(hash);
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
            if (kv.length == 2) map.put(kv[0], java.net.URLDecoder.decode(kv[1], StandardCharsets.UTF_8));
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