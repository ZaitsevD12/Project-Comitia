package com.mypeak.repository;

import com.mypeak.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByGenre(String genre);
    List<Game> findByPlatformsContaining(String platform);
    List<Game> findByTitleContainingIgnoreCase(String title);
    Game findByTitle(String title);
    boolean existsByTitle(String title);

    @Query("SELECT g FROM Game g ORDER BY g.overallRating DESC")
    List<Game> findTopRated();

    @Query("SELECT g FROM Game g ORDER BY g.totalReviews DESC")
    List<Game> findPopular();
}