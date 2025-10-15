package com.mgaye.moneytransfer.controller;

import com.mgaye.moneytransfer.dto.UserDto;
import com.mgaye.moneytransfer.dto.request.AttachPaymentMethodRequest;
import com.mgaye.moneytransfer.entity.User;
import com.mgaye.moneytransfer.repository.CardRepository;
import com.mgaye.moneytransfer.repository.UserRepository;
import com.mgaye.moneytransfer.service.UserService;
import com.stripe.exception.StripeException;

import java.util.Map;
import java.util.Optional;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final CardRepository cardRepository;

    public UserController(UserService userService, UserRepository userRepository, CardRepository cardRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.cardRepository = cardRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody UserDto dto) {
        User u = userService.createUser(
                dto.getUsername(),
                dto.getEmail(),
                dto.getPassword(),
                dto.getPhoneNumber());

        UserDto out = UserDto.fromEntity(u, false); // new users have no card
        out.setPassword(null);
        return ResponseEntity.ok(out);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(u -> UserDto.fromEntity(u, false)) // or check card repo if you want
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
    // return userService.getUser(id)
    // .map(UserDto::fromEntity)
    // .map(ResponseEntity::ok)
    // .orElse(ResponseEntity.notFound().build());
    // }

    // @GetMapping("/me")
    // public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal
    // UserDetails userDetails) {
    // if (userDetails == null)
    // ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    // User user = userService.findByEmail(userDetails.getUsername())
    // .orElseThrow(() -> new RuntimeException("User not found"));
    // return ResponseEntity.ok(UserDto.fromEntity(user));
    // }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔹 Option A: Single card support
        // boolean hasSavedCard = user.getStripePaymentMethodId() != null;

        // 🔹 Option B: Multi-card support (using your Card entity)
        boolean hasSavedCard = !cardRepository.findByUserId(user.getId()).isEmpty();

        return ResponseEntity.ok(UserDto.fromEntity(user, hasSavedCard));
    }

    // @PostMapping("/{userId}/payment-method")
    // public ResponseEntity<Map<String, String>> attachPaymentMethod(
    // @PathVariable Long userId,
    // @RequestBody Map<String, String> body) {
    // try {
    // String paymentMethodId = body.get("paymentMethodId");
    // userService.attachPaymentMethod(userId, paymentMethodId);
    // return ResponseEntity.ok(Map.of("message", "Payment method attached
    // successfully"));
    // } catch (StripeException e) {
    // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
    // .body(Map.of("error", "Stripe error: " + e.getMessage()));
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
    // .body(Map.of("error", e.getMessage()));
    // }
    // }

    @PostMapping("/{userId}/payment-method")
    public ResponseEntity<Map<String, String>> attachPaymentMethod(
            @PathVariable Long userId,
            @RequestBody AttachPaymentMethodRequest request) {
        try {
            userService.attachPaymentMethod(userId, request.getPaymentMethodId());
            return ResponseEntity.ok(Map.of("message", "Payment method attached successfully"));
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

}
