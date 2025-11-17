package com.mypeak.dto;

import lombok.Data;

@Data
public class AddReviewRequest {
    private Long gameId;
    private Long userId;
    private Integer score;
    private String reviewText;
    private Integer hoursPlayed;
    private String platform;
    private Boolean completed;
    private Boolean recommended;
    private String screenshot;
}