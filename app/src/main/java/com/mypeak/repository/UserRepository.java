// com/mypeak/repository/UserRepository.java
package com.mypeak.repository;

import com.mypeak.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByTelegramId(Long telegramId);

    @Query("select count(r) from Review r where r.user.id = :userId")
    int countReviewsByUserId(@Param("userId") Long userId);

    @Query("select avg(r.score) from Review r where r.user.id = :userId")
    Double averageScoreByUserId(@Param("userId") Long userId);
}