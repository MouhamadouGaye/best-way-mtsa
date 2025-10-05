package com.mgaye.moneytransfer.dto;

import com.mgaye.moneytransfer.entity.User;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String phoneNumber;

    private boolean hasSavedCard; // 🔹 new field

    // ✅ Convert from entity
    public static UserDto fromEntity(User user, boolean hasSavedCard) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setHasSavedCard(hasSavedCard);
        return dto;
    }

    // ✅ Convert to entity (if you need it)
    public User toEntity() {
        User user = new User();
        user.setId(this.id);
        user.setUsername(this.username);
        user.setEmail(this.email);
        user.setPassword(this.password);
        user.setPhoneNumber(this.phoneNumber);
        return user;
    }

    // // getters & setters
    // public Long getId() { return id; }
    // public void setId(Long id) { this.id = id; }

    // public String getUsername() { return username; }
    // public void setUsername(String username) { this.username = username; }

    // public String getEmail() { return email; }
    // public void setEmail(String email) { this.email = email; }

    // public String getPassword() { return password; }
    // public void setPassword(String password) { this.password = password; }

    // public String getPhoneNumber() { return phoneNumber; }
    // public void setPhoneNumber(String phoneNumber) { this.phoneNumber =
    // phoneNumber; }

}