package com.mypeak.service;
import com.mypeak.dto.AddReviewRequest;
import com.mypeak.dto.ReviewDTO;
import com.mypeak.entity.Like;
import com.mypeak.entity.Review;
import com.mypeak.entity.Game;
import com.mypeak.entity.User;
import com.mypeak.repository.LikeRepository;
import com.mypeak.repository.ReviewRepository;
import com.mypeak.repository.GameRepository;
import com.mypeak.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
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
    private LikeRepository likeRepository;
    @Autowired
    private GameService gameService;
    @Autowired
    private SteamService steamService;
    public List<ReviewDTO> getReviewsByGameId(Long gameId, Long currentUserId) {
        return reviewRepository.findByGameId(gameId).stream().map(r -> toDTO(r, currentUserId)).collect(Collectors.toList());
    }
    public List<ReviewDTO> getReviewsByUserId(Long userId, Long currentUserId) {
        return reviewRepository.findByUserId(userId).stream().map(r -> toDTO(r, currentUserId)).collect(Collectors.toList());
    }
    public Optional<ReviewDTO> getReviewById(Long id, Long currentUserId) {
        return reviewRepository.findById(id).map(r -> toDTO(r, currentUserId));
    }
    @Transactional
    public ReviewDTO addReview(AddReviewRequest request) {
        // Проверка на дубликат (оптимизация: не дать добавить дубль)
        List<Review> existing = reviewRepository.findByUserId(request.getUserId()).stream()
                .filter(r -> r.getGame().getId().equals(request.getGameId()))
                .toList();
        if (!existing.isEmpty()) {
            throw new RuntimeException("Duplicate review");
        }
        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));
        Game game = gameRepository.findById(request.getGameId()).orElseThrow(() -> new RuntimeException("Game not found with id: " + request.getGameId()));
        // Check if game is released
        boolean isReleased;
        if (game.getSteamAppId() != null) {
            isReleased = steamService.isGameReleased(game.getSteamAppId());
        } else if (game.getReleaseDate() != null) {
            isReleased = !LocalDate.now().isBefore(game.getReleaseDate());
        } else {
            isReleased = true; // If no info, allow
        }
        if (!isReleased) {
            throw new RuntimeException("Game not released yet");
        }
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
        if ("PC".equals(review.getPlatform()) && game.getSteamAppId() != null && user.getSteamId() != null) {
            review.setVerified(steamService.userOwnsGame(user.getSteamId(), game.getSteamAppId()));
        } else {
            review.setVerified(false);
        }
        review = reviewRepository.save(review);
        // Обновить рейтинг игры
        gameService.updateGameRating(game.getId());
        return toDTO(review, request.getUserId());
    }
    @Transactional
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
        if ("PC".equals(review.getPlatform()) && review.getGame().getSteamAppId() != null && review.getUser().getSteamId() != null) {
            review.setVerified(steamService.userOwnsGame(review.getUser().getSteamId(), review.getGame().getSteamAppId()));
        } else {
            review.setVerified(false);
        }
        review = reviewRepository.save(review);
        gameService.updateGameRating(review.getGame().getId());
        return toDTO(review, request.getUserId());
    }
    @Transactional
    public void deleteReview(Long id, Long userId) {
        Review review = reviewRepository.findById(id).orElseThrow();
        // Check ownership
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not owner");
        }
        reviewRepository.delete(review);
        gameService.updateGameRating(review.getGame().getId());
    }
    public void voteReview(Long reviewId, Long userId, boolean isLike) {
        Optional<Like> existing = likeRepository.findByUserIdAndReviewId(userId, reviewId);
        if (existing.isPresent()) {
            if (existing.get().isPositive() == isLike) {
                likeRepository.delete(existing.get());
            } else {
                existing.get().setPositive(isLike);
                likeRepository.save(existing.get());
            }
        } else {
            Like like = new Like();
            like.setUser(userRepository.findById(userId).orElseThrow());
            like.setReview(reviewRepository.findById(reviewId).orElseThrow());
            like.setPositive(isLike);
            likeRepository.save(like);
        }
    }
    private ReviewDTO toDTO(Review review, Long currentUserId) {
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
        dto.setLikes(likeRepository.countByReviewIdAndPositive(review.getId(), true));
        dto.setDislikes(likeRepository.countByReviewIdAndPositive(review.getId(), false));
        if (currentUserId != null) {
            Optional<Like> userVote = likeRepository.findByUserIdAndReviewId(currentUserId, review.getId());
            dto.setUserLiked(userVote.isPresent() && userVote.get().isPositive());
            dto.setUserDisliked(userVote.isPresent() && !userVote.get().isPositive());
        }
        return dto;
    }
}