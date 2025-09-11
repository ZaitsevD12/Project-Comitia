package com.mypeak.service;

import com.mypeak.dto.AddReviewRequest;
import com.mypeak.dto.ReviewDTO;
import com.mypeak.entity.Review;
import com.mypeak.entity.Game;
import com.mypeak.entity.User;
import com.mypeak.repository.ReviewRepository;
import com.mypeak.repository.GameRepository;
import com.mypeak.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GameService gameService;

    public List<ReviewDTO> getReviewsByGameId(Long gameId) {
        return reviewRepository.findByGameId(gameId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ReviewDTO> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Optional<ReviewDTO> getReviewById(Long id) {
        return reviewRepository.findById(id).map(this::toDTO);
    }

    public ReviewDTO addReview(AddReviewRequest request) {
        // Проверка на дубликат (оптимизация: не дать добавить дубль)
        List<Review> existing = reviewRepository.findByUserId(request.getUserId()).stream()
                .filter(r -> r.getGame().getId().equals(request.getGameId()))
                .toList();
        if (!existing.isEmpty()) {
            throw new RuntimeException("Duplicate review");
        }

        User user = userRepository.findById(request.getUserId()).orElseThrow();
        Game game = gameRepository.findById(request.getGameId()).orElseThrow();

        Review review = new Review();
        review.setUser(user);
        review.setGame(game);
        review.setScore(request.getScore());
        review.setReviewText(request.getReviewText());
        review.setHoursPlayed(request.getHoursPlayed());
        review.setPlatform(request.getPlatform());
        review.setCompleted(request.getCompleted());
        review.setRecommended(request.getRecommended());
        review.setScreenshot(request.getScreenshot());
        // TODO: В реале добавить верификацию (например, OCR или Steam API)
        review.setVerified(false);

        review = reviewRepository.save(review);

        // Обновить рейтинг игры
        gameService.updateGameRating(game.getId());

        return toDTO(review);
    }

    public ReviewDTO updateReview(Long id, AddReviewRequest request) {
        Review review = reviewRepository.findById(id).orElseThrow();
        // Check ownership
        if (!review.getUser().getId().equals(request.getUserId())) {
            throw new RuntimeException("Not owner");
        }
        review.setScore(request.getScore());
        review.setReviewText(request.getReviewText());
        review.setHoursPlayed(request.getHoursPlayed());
        review.setPlatform(request.getPlatform());
        review.setCompleted(request.getCompleted());
        review.setRecommended(request.getRecommended());
        review.setScreenshot(request.getScreenshot());
        review = reviewRepository.save(review);
        gameService.updateGameRating(review.getGame().getId());
        return toDTO(review);
    }

    public void deleteReview(Long id, Long userId) {
        Review review = reviewRepository.findById(id).orElseThrow();
        // Check ownership
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not owner");
        }
        reviewRepository.delete(review);
        gameService.updateGameRating(review.getGame().getId());
    }

    private ReviewDTO toDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setUserId(review.getUser().getId());
        dto.setUserName(review.getUser().getName());
        dto.setUserAvatar(review.getUser().getAvatar());
        dto.setGameId(review.getGame().getId());
        dto.setGameTitle(review.getGame().getTitle());
        dto.setGameImage(review.getGame().getImage());
        dto.setScore(review.getScore());
        dto.setReviewText(review.getReviewText());
        dto.setHoursPlayed(review.getHoursPlayed());
        dto.setPlatform(review.getPlatform());
        dto.setCompleted(review.getCompleted());
        dto.setRecommended(review.getRecommended());
        dto.setScreenshot(review.getScreenshot());
        dto.setVerified(review.getVerified());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}