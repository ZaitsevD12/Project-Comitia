// com/mypeak/repository/GameRepository.java
package com.mypeak.repository;

import com.mypeak.entity.Game;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByGenre(String genre);
    List<Game> findByPlatformsContaining(String platform);

    @EntityGraph(attributePaths = {"platforms"})
    List<Game> findByTitleContainingIgnoreCase(String title);

    Game findByTitle(String title);
    boolean existsByTitle(String title);

    @EntityGraph(attributePaths = {"platforms"})
    List<Game> findAll();

    @EntityGraph(attributePaths = {"platforms"})
    @Query("SELECT g FROM Game g ORDER BY g.overallRating DESC")
    List<Game> findTopRated();

    @EntityGraph(attributePaths = {"platforms"})
    @Query("SELECT g FROM Game g ORDER BY g.totalReviews DESC")
    List<Game> findPopular();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT g FROM Game g WHERE g.id = :id")
    Optional<Game> findByIdForUpdate(@Param("id") Long id);
}