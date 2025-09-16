package com.mypeak.controller;

import com.mypeak.dto.AddGameRequest;
import com.mypeak.dto.GameDTO;
import com.mypeak.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/games")
public class GameController {
    @Autowired
    private GameService gameService;

    @GetMapping
    public List<GameDTO> getAllGames(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String platform) {
        return gameService.getAllGames(search, genre, platform);
    }

    @GetMapping("/top-rated")
    public List<GameDTO> getTopRated(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String platform) {
        return gameService.getTopRated(genre, platform);
    }

    @GetMapping("/popular")
    public List<GameDTO> getPopular(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String platform) {
        return gameService.getPopular(genre, platform);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameDTO> getGameById(@PathVariable Long id) {
        return gameService.getGameById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

//    @PostMapping
//    public GameDTO addGame(@RequestBody AddGameRequest request) {
//        return gameService.addGame(request);
//    }
}