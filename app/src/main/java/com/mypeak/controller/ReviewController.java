package com.mypeak.controller;

import com.mypeak.dto.AddReviewRequest;
import com.mypeak.dto.ReviewDTO;
import com.mypeak.dto.VoteRequest;
import com.mypeak.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "${app.allowed.origin}")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long id, @RequestParam(required = false) Long currentUserId) {
        return reviewService.getReviewById(id, currentUserId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/game/{gameId}")
    public List<ReviewDTO> getReviewsByGame(@PathVariable Long gameId, @RequestParam(required = false) Long currentUserId) {
        return reviewService.getReviewsByGameId(gameId, currentUserId);
    }

    @GetMapping("/user/{userId}")
    public List<ReviewDTO> getReviewsByUser(@PathVariable Long userId, @RequestParam(required = false) Long currentUserId) {
        return reviewService.getReviewsByUserId(userId, currentUserId);
    }

    @PostMapping
    public ReviewDTO addReview(@RequestBody AddReviewRequest request) {
        Long authUserId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        if (!authUserId.equals(request.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }
        return reviewService.addReview(request);
    }

    @PutMapping("/{id}")
    public ReviewDTO updateReview(@PathVariable Long id, @RequestBody AddReviewRequest request) {
        Long authUserId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        if (!authUserId.equals(request.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }
        return reviewService.updateReview(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id, @RequestParam Long userId) {
        Long authUserId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        if (!authUserId.equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        reviewService.deleteReview(id, userId);
    }

    @PostMapping("/{reviewId}/vote")
    public void voteReview(@PathVariable Long reviewId, @RequestBody VoteRequest request) {
        Long authUserId = Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
        if (!authUserId.equals(request.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }
        reviewService.voteReview(reviewId, request.getUserId(), request.isLike());
    }
}