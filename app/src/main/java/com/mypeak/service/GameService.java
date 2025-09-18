package com.mypeak.service;

import com.mypeak.dto.AddGameRequest;
import com.mypeak.dto.GameDTO;
import com.mypeak.entity.Game;
import com.mypeak.entity.Review;
import com.mypeak.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GameService {
    @Autowired
    private GameRepository gameRepository;

    public List<GameDTO> getAllGames(String search, String genre, String platform) {
        List<Game> games;
        if (search != null && !search.isEmpty()) {
            games = gameRepository.findByTitleContainingIgnoreCase(search);
        } else {
            games = gameRepository.findAll();
        }
        if (genre != null && !"All".equals(genre)) {
            games = games.stream().filter(g -> g.getGenre().equals(genre)).collect(Collectors.toList());
        }
        if (platform != null && !"All".equals(platform)) {
            games = games.stream().filter(g -> g.getPlatforms().contains(platform)).collect(Collectors.toList());
        }
        return games.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<GameDTO> getTopRated(String genre, String platform) {
        List<Game> games = gameRepository.findTopRated();
        if (genre != null && !"All".equals(genre)) {
            games = games.stream().filter(g -> g.getGenre().equals(genre)).collect(Collectors.toList());
        }
        if (platform != null && !"All".equals(platform)) {
            games = games.stream().filter(g -> g.getPlatforms().contains(platform)).collect(Collectors.toList());
        }
        return games.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<GameDTO> getPopular(String genre, String platform) {
        List<Game> games = gameRepository.findAll();
        if (genre != null && !"All".equals(genre)) {
            games = games.stream().filter(g -> g.getGenre().equals(genre)).collect(Collectors.toList());
        }
        if (platform != null && !"All".equals(platform)) {
            games = games.stream().filter(g -> g.getPlatforms().contains(platform)).collect(Collectors.toList());
        }
        LocalDate now = LocalDate.now();
        games = games.stream()
                .sorted((a, b) -> {
                    LocalDate releaseA = a.getReleaseDate() != null ? a.getReleaseDate() : now;
                    LocalDate releaseB = b.getReleaseDate() != null ? b.getReleaseDate() : now;
                    double scoreA = a.getTotalReviews() / (ChronoUnit.YEARS.between(LocalDate.of(releaseA.getYear(), 1, 1), now) + 1);
                    double scoreB = b.getTotalReviews() / (ChronoUnit.YEARS.between(LocalDate.of(releaseB.getYear(), 1, 1), now) + 1);
                    return Double.compare(scoreB, scoreA);
                })
                .collect(Collectors.toList());
        return games.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Optional<GameDTO> getGameById(Long id) {
        return gameRepository.findById(id).map(this::toDTO);
    }

    public GameDTO addGame(AddGameRequest request) {
        Game game = new Game();
        game.setTitle(request.getTitle());
        game.setDescription(request.getDescription());
        game.setGenre(request.getGenre());
        game.setPlatforms(request.getPlatforms());
        game.setImage(request.getImage());
        game.setReleaseDate(request.getReleaseDate());
        game.setDeveloper(request.getDeveloper());
        game.setSteamAppId(request.getSteamAppId());
        game = gameRepository.save(game);
        return toDTO(game);
    }

    public void updateGameRating(Long gameId) {
        Game game = gameRepository.findById(gameId).orElseThrow();
        List<Review> reviews = game.getReviews();
        if (!reviews.isEmpty()) {
            double totalWeight = 0.0;
            double weightedSum = 0.0;
            for (Review r : reviews) {
                double weight = 1 + (0.001 * Math.log(r.getReviewText().length() + 1)) + (0.01 * Math.sqrt(r.getHoursPlayed())) + (r.getCompleted() ? 0.5 : 0);
                if (r.getVerified()) weight *= 10;
                weightedSum += r.getScore() * weight;
                totalWeight += weight;
            }
            double avg = weightedSum / totalWeight;
            game.setOverallRating(avg);
            game.setTotalReviews(reviews.size());
            gameRepository.save(game);
        }
    }

    private GameDTO toDTO(Game game) {
        GameDTO dto = new GameDTO();
        dto.setId(game.getId());
        dto.setTitle(game.getTitle());
        dto.setDescription(game.getDescription());
        dto.setGenre(game.getGenre());
        dto.setPlatforms(game.getPlatforms());
        dto.setImage(game.getImage());
        dto.setOverallRating(game.getOverallRating());
        dto.setTotalReviews(game.getTotalReviews());
        dto.setReleaseDate(game.getReleaseDate());
        dto.setDeveloper(game.getDeveloper());
        dto.setSteamAppId(game.getSteamAppId());
        return dto;
    }
}