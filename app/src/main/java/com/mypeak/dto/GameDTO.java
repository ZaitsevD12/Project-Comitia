package com.mypeak.dto;

import lombok.Data;

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
    private Integer releaseYear;
    private String developer;
}