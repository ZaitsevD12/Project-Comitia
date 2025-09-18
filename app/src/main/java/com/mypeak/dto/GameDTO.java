package com.mypeak.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class GameDTO {
    private Long id;
    private String title;
    private String description;
    private String genre;
    private List<String> platforms;
    private String image;
    private Double overallRating;
    private Integer totalReviews;
    private LocalDate releaseDate;
    private String developer;
    private Long steamAppId;
}