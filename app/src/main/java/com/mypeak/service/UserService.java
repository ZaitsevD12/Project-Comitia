package com.mypeak.service;

import com.mypeak.dto.UserDTO;
import com.mypeak.entity.User;
import com.mypeak.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.mypeak.entity.Review;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id).map(this::toDTO);
    }

    // Для демо: Создать пользователя если нет
    public UserDTO createUser(String name, String avatar) {
        User user = new User();
        user.setName(name);
        user.setAvatar(avatar);
        user = userRepository.save(user);
        return toDTO(user);
    }

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setAvatar(user.getAvatar());
        dto.setTotalReviews(user.getReviews() != null ? user.getReviews().size() : 0);
        dto.setAverageRating(user.getReviews() != null && !user.getReviews().isEmpty() ?
                user.getReviews().stream().mapToDouble(Review::getScore).average().getAsDouble() : 0.0);
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public Optional<User> findByTelegramId(Long telegramId) {
        return userRepository.findByTelegramId(telegramId);
    }
}