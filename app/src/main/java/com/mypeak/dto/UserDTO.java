package com.mypeak.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String avatar;
    private Integer totalReviews;
    private Double averageRating;
}