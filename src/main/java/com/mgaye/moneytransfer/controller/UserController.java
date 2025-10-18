// package com.mgaye.moneytransfer.controller;

// import com.mgaye.moneytransfer.dto.UserDto;
// import com.mgaye.moneytransfer.dto.request.AttachPaymentMethodRequest;
// import com.mgaye.moneytransfer.entity.User;
// import com.mgaye.moneytransfer.repository.CardRepository;
// import com.mgaye.moneytransfer.repository.UserRepository;
// import com.mgaye.moneytransfer.service.UserService;
// import com.stripe.exception.StripeException;

// import java.util.Map;
// import java.util.Optional;

// import org.apache.catalina.connector.Response;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.web.bind.annotation.*;

// @CrossOrigin(origins = "http://localhost:4200")
// @RestController
// @RequestMapping("/api/users")
// public class UserController {
//     private final UserService userService;
//     private final UserRepository userRepository;
//     private final CardRepository cardRepository;

//     public UserController(UserService userService, UserRepository userRepository, CardRepository cardRepository) {
//         this.userService = userService;
//         this.userRepository = userRepository;
//         this.cardRepository = cardRepository;
//     }

//     @PostMapping("/register")
//     public ResponseEntity<UserDto> register(@RequestBody UserDto dto) {
//         User u = userService.createUser(
//                 dto.getUsername(),
//                 dto.getEmail(),
//                 dto.getPassword(),
//                 dto.getPhoneNumber());

//         UserDto out = UserDto.fromEntity(u, false); // new users have no card
//         out.setPassword(null);
//         return ResponseEntity.ok(out);
//     }

//     @GetMapping("/{id}")
//     public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
//         return userService.findById(id)
//                 .map(u -> UserDto.fromEntity(u, false)) // or check card repo if you want
//                 .map(ResponseEntity::ok)
//                 .orElse(ResponseEntity.notFound().build());
//     }

//     @GetMapping("/me")
//     public ResponseEntity<UserDto> getCurrentUser(
//             @AuthenticationPrincipal UserDetails userDetails) {
//         if (userDetails == null) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         User user = userService.findByEmail(userDetails.getUsername())
//                 .orElseThrow(() -> new RuntimeException("User not found"));

//         // 🔹 Option A: Single card support
//         // boolean hasSavedCard = user.getStripePaymentMethodId() != null;

//         // 🔹 Option B: Multi-card support (using your Card entity)
//         boolean hasSavedCard = !cardRepository.findByUserId(user.getId()).isEmpty();

//         return ResponseEntity.ok(UserDto.fromEntity(user, hasSavedCard));
//     }

//     @PostMapping("/{userId}/payment-method")
//     public ResponseEntity<Map<String, String>> attachPaymentMethod(
//             @PathVariable Long userId,
//             @RequestBody AttachPaymentMethodRequest request) {
//         try {
//             userService.attachPaymentMethod(userId, request.getPaymentMethodId());
//             return ResponseEntity.ok(Map.of("message", "Payment method attached successfully"));
//         } catch (StripeException e) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                     .body(Map.of("error", "Stripe error: " + e.getMessage()));
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                     .body(Map.of("error", e.getMessage()));
//         }
//     }

// }

package com.mgaye.moneytransfer.controller;

import com.mgaye.moneytransfer.dto.UserDto;
import com.mgaye.moneytransfer.dto.request.AttachPaymentMethodRequest;
import com.mgaye.moneytransfer.dto.request.ChangePasswordRequest;
import com.mgaye.moneytransfer.dto.request.RegistrationRequest;
import com.mgaye.moneytransfer.dto.request.ResetPasswordRequest;
import com.mgaye.moneytransfer.dto.request.UpdateEmailRequest;
import com.mgaye.moneytransfer.dto.request.UpdateProfileRequest;
import com.mgaye.moneytransfer.entity.Card;
import com.mgaye.moneytransfer.entity.User;
import com.mgaye.moneytransfer.exception.InvalidCredentialsException;
import com.mgaye.moneytransfer.exception.InvalidPhoneNumberException;
import com.mgaye.moneytransfer.repository.CardRepository;
import com.mgaye.moneytransfer.repository.UserRepository;
import com.mgaye.moneytransfer.service.AuditService;
import com.mgaye.moneytransfer.service.UserService;
import com.mgaye.moneytransfer.service.impl.EmailService;
import com.stripe.exception.StripeException;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final CardRepository cardRepository;
    private final AuditService auditService;
    private final EmailService emailService;

    public UserController(UserService userService, UserRepository userRepository,
            CardRepository cardRepository, AuditService auditService,
            EmailService emailService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.cardRepository = cardRepository;
        this.auditService = auditService;
        this.emailService = emailService;
    }

    // ✅ SECURE PROFILE UPDATE - Only non-sensitive fields
    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Track changes for audit
        Map<String, String> changes = new HashMap<>();

        if (request.getName() != null && !request.getName().trim().isEmpty()
                && !request.getName().trim().equals(user.getUsername())) {
            changes.put("username", user.getUsername() + " -> " + request.getName());
            user.setUsername(request.getName().trim());
        }

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()
                && !request.getPhoneNumber().trim().equals(user.getPhoneNumber())) {
            if (isValidPhoneNumber(request.getPhoneNumber())) {
                changes.put("phoneNumber", user.getPhoneNumber() + " -> " + request.getPhoneNumber());
                user.setPhoneNumber(request.getPhoneNumber().trim());
            } else {
                throw new InvalidPhoneNumberException("Invalid phone number format");
            }
        }

        User updatedUser = userRepository.save(user);

        // Audit the profile changes
        if (!changes.isEmpty()) {
            auditService.logProfileUpdate(user.getId(), changes, "PROFILE_UPDATE");

            // Send profile update notification
            emailService.sendSuspiciousActivityAlert(
                    user.getEmail(),
                    user.getUsername(),
                    "Profile information updated: " + String.join(", ", changes.keySet()));
        }

        boolean hasSavedCard = !cardRepository.findByUserId(updatedUser.getId()).isEmpty();

        return ResponseEntity.ok(UserDto.fromEntity(updatedUser, hasSavedCard));
    }

    // ✅ SEPARATE ENDPOINT FOR EMAIL CHANGE (requires verification)
    @PutMapping("/email")
    public ResponseEntity<Map<String, String>> updateEmail(
            @Valid @RequestBody UpdateEmailRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Additional verification for email changes
        if (!userService.verifyPassword(user.getId(), request.getPassword())) {
            // Log failed attempt
            auditService.logFailedAttempt(user.getId(), "EMAIL_CHANGE_FAILED",
                    "Password verification failed for email change", "N/A", "API");

            throw new InvalidCredentialsException("Password verification failed");
        }

        userService.initiateEmailChange(user.getId(), request.getNewEmail());

        auditService.logSecurityEvent(user.getId(), "EMAIL_CHANGE_INITIATED",
                user.getEmail() + " -> " + request.getNewEmail());

        return ResponseEntity.ok(Map.of(
                "message", "Email verification sent to new email address"));
    }

    // ✅ EMAIL CHANGE VERIFICATION ENDPOINT
    @PostMapping("/verify-email-change")
    public ResponseEntity<Map<String, String>> verifyEmailChange(
            @RequestParam String token) {

        try {
            userService.confirmEmailChange(token);

            // Get the user to send confirmation email (you might need to adjust this based
            // on your implementation)
            User user = userRepository.findByEmailVerificationToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid token"));

            // Send confirmation email
            emailService.sendEmailChangeConfirmation(
                    user.getEmail(),
                    user.getPendingEmail(), // This should be the old email after confirmation
                    user.getUsername());

            auditService.logSecurityEvent(user.getId(), "EMAIL_CHANGE_COMPLETED",
                    "Email successfully changed");

            return ResponseEntity.ok(Map.of("message", "Email address updated successfully"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ PASSWORD CHANGE ENDPOINT
    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            userService.changePassword(user.getId(), request.getCurrentPassword(), request.getNewPassword());

            // Send password change notification
            emailService.sendPasswordChangedEmail(user.getEmail(), user.getUsername());
            emailService.sendPasswordChangeNotification(user.getEmail(), user.getUsername());

            auditService.logSecurityEvent(user.getId(), "PASSWORD_CHANGED",
                    "Password successfully updated");

            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));

        } catch (RuntimeException e) {
            auditService.logFailedAttempt(user.getId(), "PASSWORD_CHANGE_FAILED",
                    "Password change failed: " + e.getMessage(), "N/A", "API");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ SECURE USER REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegistrationRequest request) {
        // Additional validation for money transfer app
        if (!isValidPhoneNumber(request.getPhoneNumber())) {
            throw new InvalidPhoneNumberException("Invalid phone number format");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(null); // Or return a proper error DTO
        }

        User user = userService.createUser(
                request.getUsername().trim(),
                request.getEmail().toLowerCase().trim(),
                request.getPassword(),
                request.getPhoneNumber().trim());

        // Send welcome email
        emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());

        // Send account verification email if needed
        if (user.getEmailVerificationToken() != null) {
            emailService.sendAccountVerificationEmail(
                    user.getEmail(),
                    user.getEmailVerificationToken(),
                    user.getUsername());
        }

        auditService.logSecurityEvent(user.getId(), "USER_REGISTERED", "New user registration");

        UserDto response = UserDto.fromEntity(user, false);
        response.setPassword(null); // Never return password
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ✅ ACCOUNT VERIFICATION ENDPOINT
    @PostMapping("/verify-account")
    public ResponseEntity<Map<String, String>> verifyAccount(@RequestParam String token) {
        try {
            // You'll need to implement this method in UserService
            userService.verifyAccount(token);

            User user = userRepository.findByEmailVerificationToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid token"));

            // Send account verified email
            emailService.sendAccountVerifiedEmail(user.getEmail(), user.getUsername());

            auditService.logSecurityEvent(user.getId(), "ACCOUNT_VERIFIED",
                    "Email verification completed");

            return ResponseEntity.ok(Map.of("message", "Account verified successfully"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ PASSWORD RESET REQUEST ENDPOINT
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestParam String email) {
        try {
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Generate reset token (you'll need to implement this in UserService)
            String resetToken = userService.generatePasswordResetToken(user.getId());

            // Send password reset email
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken, user.getUsername());

            auditService.logSecurityEvent(user.getId(), "PASSWORD_RESET_REQUESTED",
                    "Password reset link sent");

            return ResponseEntity.ok(Map.of("message", "Password reset instructions sent to your email"));

        } catch (RuntimeException e) {
            // Don't reveal whether email exists or not for security
            return ResponseEntity
                    .ok(Map.of("message", "If an account exists, password reset instructions will be sent"));
        }
    }

    // ✅ PASSWORD RESET CONFIRMATION ENDPOINT
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        try {
            userService.resetPassword(request.getToken(), request.getNewPassword());

            // Get user from token to send notification
            User user = userService.getUserByResetToken(request.getToken());

            // Send password changed notification
            emailService.sendPasswordChangedEmail(user.getEmail(), user.getUsername());

            auditService.logSecurityEvent(user.getId(), "PASSWORD_RESET_COMPLETED",
                    "Password reset via reset token");

            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ SECURE CURRENT USER ENDPOINT
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean hasSavedCard = !cardRepository.findByUserId(user.getId()).isEmpty();

        return ResponseEntity.ok(UserDto.fromEntity(user, hasSavedCard));
    }

    // ✅ SECURE PAYMENT METHOD ATTACHMENT
    @PostMapping("/payment-method")
    public ResponseEntity<Map<String, String>> attachPaymentMethod(
            @Valid @RequestBody AttachPaymentMethodRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            userService.attachPaymentMethod(user.getId(), request.getPaymentMethodId());

            // Get card details to send notification
            Card card = cardRepository.findByStripePaymentMethodId(request.getPaymentMethodId())
                    .orElseThrow(() -> new RuntimeException("Card not found after attachment"));

            // Send payment method added notification
            emailService.sendPaymentMethodAdded(
                    user.getEmail(),
                    user.getUsername(),
                    card.getLast4(),
                    card.getBrand());

            auditService.logSecurityEvent(user.getId(), "PAYMENT_METHOD_ADDED",
                    "Payment method attached: " + request.getPaymentMethodId());

            return ResponseEntity.ok(Map.of("message", "Payment method attached successfully"));
        } catch (StripeException e) {
            auditService.logSecurityEvent(user.getId(), "PAYMENT_METHOD_FAILED",
                    "Stripe error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Payment method attachment failed"));
        }
    }

    // ✅ PAYMENT METHOD REMOVAL ENDPOINT
    @DeleteMapping("/payment-method/{cardId}")
    public ResponseEntity<Map<String, String>> removePaymentMethod(
            @PathVariable Long cardId,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));

        // Verify the card belongs to the user
        if (!card.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied"));
        }

        try {
            // Store card details for notification before deletion
            String last4 = card.getLast4();
            String brand = card.getBrand();

            cardRepository.delete(card);

            // Send payment method removed notification
            emailService.sendPaymentMethodRemoved(user.getEmail(), user.getUsername(), last4, brand);

            auditService.logSecurityEvent(user.getId(), "PAYMENT_METHOD_REMOVED",
                    "Payment method removed: " + cardId);

            return ResponseEntity.ok(Map.of("message", "Payment method removed successfully"));

        } catch (Exception e) {
            auditService.logSecurityEvent(user.getId(), "PAYMENT_METHOD_REMOVAL_FAILED",
                    "Failed to remove payment method: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to remove payment method"));
        }
    }

    // ✅ PHONE NUMBER VALIDATION
    private boolean isValidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null)
            return false;

        // E.164 format validation for international numbers
        String cleaned = phoneNumber.trim().replaceAll("\\s+", "");
        return cleaned.matches("^\\+[1-9]\\d{1,14}$");
    }
}
