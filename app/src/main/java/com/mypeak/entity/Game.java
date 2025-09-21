// com/mypeak/entity/Game.java
package com.mypeak.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "games", indexes = {
        @Index(columnList = "title"),
        @Index(columnList = "genre")
})
@Data
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String title;
    private String description;
    private String genre;
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> platforms;
    private String image;
    private Double overallRating = 0.0;
    private Integer totalReviews = 0;
    private LocalDate releaseDate;
    private String developer;
    @Column(name = "steam_app_id")
    private Long steamAppId;
    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<Review> reviews;
}