package com.mypeak.controller;

import com.mypeak.dto.UserDTO;
import com.mypeak.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@CrossOrigin(origins = "https://62a47138bf11.ngrok-free.app")
@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        logger.info("Fetching user with ID: {}", id);
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            logger.warn("No authentication found for user ID: {}", id);
            return ResponseEntity.status(401).build();
        }
        Long authUserId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        if (!authUserId.equals(id)) {
            logger.warn("Unauthorized access attempt for user ID: {} by auth ID: {}", id, authUserId);
            return ResponseEntity.status(401).build();
        }
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public UserDTO createUser(@RequestParam String name, @RequestParam String avatar) {
        return userService.createUser(name, avatar);
    }
}