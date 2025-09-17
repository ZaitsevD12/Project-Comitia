package com.mypeak.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String steamId;
    private String avatar;
    private Integer totalReviews;
    private Double averageRating;
    private LocalDateTime createdAt;
}