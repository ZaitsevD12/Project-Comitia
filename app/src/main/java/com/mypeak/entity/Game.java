// Game.java (add indexes)
package com.mypeak.entity;

import jakarta.persistence.*;
import lombok.Data;
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

    private Integer releaseYear;

    private String developer;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<Review> reviews;
}