// com/mypeak/entity/Review.java
package com.mypeak.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "game_id"}))
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;

    private Integer score;

    private String reviewText;

    private Integer hoursPlayed;

    private String platform;

    private Boolean completed = false;

    private Boolean recommended = true;

    private String screenshot; // URL

    private Boolean verified = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}