// com/mypeak/config/InitData.java (removed commented code)
package com.mypeak.config;

import com.mypeak.entity.Game;
import com.mypeak.entity.Review;
import com.mypeak.entity.User;
import com.mypeak.repository.GameRepository;
import com.mypeak.repository.ReviewRepository;
import com.mypeak.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
public class InitData {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private ReviewRepository reviewRepository;
}