
package com.mgaye.moneytransfer.controller;

import com.mgaye.moneytransfer.dto.request.LoginRequest;
import com.mgaye.moneytransfer.entity.User;
import com.mgaye.moneytransfer.security.JwtUtil;
import com.mgaye.moneytransfer.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody LoginRequest request,
    // HttpServletResponse response) {
    // try {
    // if (!userService.checkCredentials(request.getEmail(), request.getPassword()))
    // {
    // throw new RuntimeException("Invalid credentials");
    // }

    // User user = userService.getByEmail(request.getEmail());
    // String token = jwtUtil.generateToken(user.getEmail());

    // Cookie cookie = new Cookie("jwt", token);
    // cookie.setHttpOnly(true);
    // cookie.setPath("/");
    // cookie.setMaxAge(24 * 60 * 60); // 24h
    // response.addCookie(cookie);

    // return ResponseEntity.ok("Login successful");
    // } catch (RuntimeException e) {
    // return ResponseEntity.status(401).body(e.getMessage());
    // }
    // }

    // Change to return JSON instead of plain text
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            if (!userService.checkCredentials(request.getEmail(), request.getPassword())) {
                throw new RuntimeException("Invalid credentials");
            }

            User user = userService.getByEmail(request.getEmail());
            String token = jwtUtil.generateToken(user.getEmail());

            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setSecure(false); // Only over HTTPS
            cookie.setAttribute("SameSite", "Strict");
            cookie.setMaxAge(15 * 60); // 24h
            response.addCookie(cookie);

            return ResponseEntity.ok().body(Map.of("message", "Login successful"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().body(Map.of("Error", "Logged out successfully"));
    }

}
