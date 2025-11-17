package com.mypeak.dto;

import lombok.Data;

@Data
public class VoteRequest {
    private Long userId;
    private boolean like;  // Was: isLike
}