package com.mypeak.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class AddGameRequest {
    private String title;
    private String description;
    private String genre;
    private List<String> platforms;
    private String image; // Base64 или URL, но для простоты URL
    private LocalDate releaseDate;
    private String developer;
    private Long steamAppId;
}