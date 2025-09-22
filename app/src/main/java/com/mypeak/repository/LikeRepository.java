// com/mypeak/repository/LikeRepository.java (added deleteByReviewId)
package com.mypeak.repository;

import com.mypeak.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserIdAndReviewId(Long userId, Long reviewId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT l FROM Like l WHERE l.user.id = :userId AND l.review.id = :reviewId")
    Optional<Like> findByUserIdAndReviewIdWithLock(@Param("userId") Long userId, @Param("reviewId") Long reviewId);
    long countByReviewIdAndPositive(Long reviewId, boolean positive);
    @Modifying
    @Query("delete from Like l where l.review.id = :reviewId")
    void deleteByReviewId(@Param("reviewId") Long reviewId);
}