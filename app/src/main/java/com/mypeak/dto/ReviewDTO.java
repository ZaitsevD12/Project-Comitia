package com.mypeak.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private Long gameId;
    private String gameTitle;
    private String gameImage;
    private Integer score;
    private String reviewText;
    private Integer hoursPlayed;
    private String platform;
    private Boolean completed;
    private Boolean recommended;
    private String screenshot;
    private Boolean verified;
    private LocalDateTime createdAt;
}