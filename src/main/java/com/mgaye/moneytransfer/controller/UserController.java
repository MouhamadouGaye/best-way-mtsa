package com.mgaye.moneytransfer.controller;

import com.mgaye.moneytransfer.dto.UserDto;
import com.mgaye.moneytransfer.entity.User;
import com.mgaye.moneytransfer.repository.UserRepository;
import com.mgaye.moneytransfer.service.UserService;
import com.stripe.exception.StripeException;

import java.util.Map;
import java.util.Optional;

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

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody UserDto dto) {
        User u = userService.createUser(
                dto.getUsername(),
                dto.getEmail(),
                dto.getPassword(),
                dto.getPhoneNumber());
        UserDto out = UserDto.fromEntity(u);
        out.setPassword(null);
        return ResponseEntity.ok(out);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(UserDto::fromEntity)
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

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(UserDto.fromEntity(user));
    }

    @PostMapping("/{userId}/payment-method")
    public ResponseEntity<String> attachPaymentMethod(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) throws StripeException {

        String pmId = body.get("paymentMethodId");
        if (pmId == null || pmId.isBlank()) {
            return ResponseEntity.badRequest().body("PaymentMethod ID is required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStripePaymentMethodId(pmId); // save pm_xxx for future payments
        userRepository.save(user);

        return ResponseEntity.ok("Payment method attached successfully");
    }

}
