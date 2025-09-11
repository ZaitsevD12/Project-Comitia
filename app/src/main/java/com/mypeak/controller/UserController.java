package com.mypeak.controller;

import com.mypeak.dto.UserDTO;
import com.mypeak.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Для демо: POST /api/users/create?name=Test&avatar=url
    @PostMapping("/create")
    public UserDTO createUser(@RequestParam String name, @RequestParam String avatar) {
        return userService.createUser(name, avatar);
    }
}