package com.mypeak.config;

import com.mypeak.entity.Game;
import com.mypeak.entity.Review;
import com.mypeak.entity.User;
import com.mypeak.repository.GameRepository;
import com.mypeak.repository.ReviewRepository;
import com.mypeak.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class InitData {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private ReviewRepository reviewRepository;

    @PostConstruct
    public void init() {
        // Создать игры (аналог mockGames)
        Game game1 = new Game();
        game1.setTitle("The Legend of Zelda: Breath of the Wild");
        game1.setGenre("Action-Adventure");
        game1.setPlatforms(List.of("Nintendo Switch"));
        game1.setImage("https://via.placeholder.com/150");
        game1.setOverallRating(97.0);
        game1.setTotalReviews(100);
        game1.setReleaseYear(2017);
        game1.setDeveloper("Nintendo");
        if (!gameRepository.existsByTitle(game1.getTitle())) {
            gameRepository.save(game1);
        }

        Game game2 = new Game();
        game2.setTitle("God of War");
        game2.setGenre("Action");
        game2.setPlatforms(List.of("PlayStation 4", "PC"));
        game2.setImage("https://via.placeholder.com/150");
        game2.setOverallRating(94.0);
        game2.setTotalReviews(150);
        game2.setReleaseYear(2018);
        game2.setDeveloper("Santa Monica Studio");
        if (!gameRepository.existsByTitle(game2.getTitle())) {
            gameRepository.save(game2);
        }
    }
}