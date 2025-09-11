package com.mypeak.dto;

import lombok.Data;

import java.util.List;

@Data
public class AddGameRequest {
    private String title;
    private String description;
    private String genre;
    private List<String> platforms;
    private String image; // Base64 или URL, но для простоты URL
    private Integer releaseYear;
    private String developer;
}