package com.mypeak.controller;

import com.mypeak.service.SteamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/steam")
public class SteamController {
    @Autowired
    private SteamService steamService;

    @GetMapping("/search")
    public void searchAndAddGame(@RequestParam String query) {
        steamService.searchAndAddIfNotExist(query);
    }
}