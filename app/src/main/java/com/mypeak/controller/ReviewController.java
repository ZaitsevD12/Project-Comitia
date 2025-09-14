package com.mypeak.controller;

import com.mypeak.dto.AddReviewRequest;
import com.mypeak.dto.ReviewDTO;
import com.mypeak.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long id) {
        return reviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/game/{gameId}")
    public List<ReviewDTO> getReviewsByGame(@PathVariable Long gameId) {
        return reviewService.getReviewsByGameId(gameId);
    }

    @GetMapping("/user/{userId}")
    public List<ReviewDTO> getReviewsByUser(@PathVariable Long userId) {
        return reviewService.getReviewsByUserId(userId);
    }

    @PostMapping
    public ReviewDTO addReview(@RequestBody AddReviewRequest request) {
        return reviewService.addReview(request);
    }

    @PutMapping("/{id}")
    public ReviewDTO updateReview(@PathVariable Long id, @RequestBody AddReviewRequest request) {
        return reviewService.updateReview(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id, @RequestParam Long userId) {
        reviewService.deleteReview(id, userId);
    }
}