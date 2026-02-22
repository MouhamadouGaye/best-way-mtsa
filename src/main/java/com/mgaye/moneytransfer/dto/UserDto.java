package com.mgaye.moneytransfer.dto;

import java.math.BigDecimal;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.mgaye.moneytransfer.entity.User;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private boolean hasSavedCard; // 🔹 new field
    private boolean emailVerified;
    private boolean authenticated; // Add this
    private boolean requiresVerification; // Add this
    private String message; // Add this
    private String currency;
    private BigDecimal balance;

    // ✅ Convert from entity
    public static UserDto fromEntity(User user, boolean hasSavedCard) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setHasSavedCard(hasSavedCard);
        dto.setEmailVerified(user.isEmailVerified());
        dto.setCurrency(user.getCurrency());
        dto.setBalance(user.getBalance());

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = auth != null
                && auth.isAuthenticated()
                && !(auth instanceof AnonymousAuthenticationToken)
                && auth.getName().equals(user.getEmail());

        dto.setAuthenticated(isAuthenticated); // Default to false for registration
        dto.setRequiresVerification(!user.isEmailVerified());
        return dto;
    }

}