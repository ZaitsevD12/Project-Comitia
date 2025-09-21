package com.mypeak.controller;

import com.mypeak.service.SteamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@CrossOrigin(origins = "https://62a47138bf11.ngrok-free.app")
@RestController
@RequestMapping("/api/steam")
public class SteamController {
    @Autowired
    private SteamService steamService;

    @GetMapping("/search")
    public void searchAndAddGame(@RequestParam String query) {
        steamService.searchAndAddIfNotExist(query);
    }

    @GetMapping("/auth-url")
    public String getAuthUrl(@RequestParam Long userId) {
        Long authUserId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        if (!authUserId.equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        return steamService.getAuthUrl(userId);
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> callback(@RequestParam Map<String, String> params) {
        String url = steamService.handleCallback(params);
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(url))
                .build();
    }

    @PostMapping("/disconnect")
    public void disconnect(@RequestParam Long userId) {
        Long authUserId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        if (!authUserId.equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        // Implement disconnect logic
    }
}