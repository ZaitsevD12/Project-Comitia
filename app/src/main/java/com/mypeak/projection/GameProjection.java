// GameProjection.java (new interface)
package com.mypeak.projection;

import java.util.List;

public interface GameProjection {
    Long getId();
    String getTitle();
    String getDescription();
    String getGenre();
    List<String> getPlatforms();
    String getImage();
    Double getOverallRating();
    Integer getTotalReviews();
    Integer getReleaseYear();
    String getDeveloper();
}