package com.mypeak.repository;

import com.mypeak.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserIdAndReviewId(Long userId, Long reviewId);
    long countByReviewIdAndPositive(Long reviewId, boolean positive);
}