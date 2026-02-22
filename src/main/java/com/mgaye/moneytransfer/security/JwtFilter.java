// package com.mgaye.moneytransfer.security;

// import java.io.IOException;

// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import com.mgaye.moneytransfer.service.UserService;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.Cookie;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;

// // @Component
// // public class JwtFilter extends OncePerRequestFilter {
// //     private final JwtUtil jwtUtil;
// //     private final UserService userService;

// //     public JwtFilter(JwtUtil jwtUtil, UserService userService) {
// //         this.jwtUtil = jwtUtil;
// //         this.userService = userService;
// //     }

// //     @Override
// //     protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
// //             throws ServletException, IOException {

// //         String token = null;

// //         // read JWT from cookie
// //         if (request.getCookies() != null) {
// //             for (Cookie cookie : request.getCookies()) {
// //                 if ("jwt".equals(cookie.getName())) {
// //                     token = cookie.getValue();
// //                 }
// //             }
// //         }

// //         if (token != null) {
// //             String username = jwtUtil.extractUsername(token);

// //             UserDetails userDetails = userService.loadUserByUsername(username);
// //             UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null,
// //                     userDetails.getAuthorities());

// //             SecurityContextHolder.getContext().setAuthentication(auth);
// //         }

// //         chain.doFilter(request, response);
// //     }
// // }
// @Component
// public class JwtFilter extends OncePerRequestFilter {

//     private final JwtUtil jwtUtil;
//     private final UserDetailsService userDetailsService;

//     public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
//         this.jwtUtil = jwtUtil;
//         this.userDetailsService = userDetailsService;
//     }

//     @Override
//     protected void doFilterInternal(HttpServletRequest request,
//             HttpServletResponse response,
//             FilterChain filterChain)
//             throws ServletException, IOException {

//         String token = null;
//         if (request.getCookies() != null) {
//             for (Cookie cookie : request.getCookies()) {
//                 if ("jwt".equals(cookie.getName())) {
//                     token = cookie.getValue();
//                 }
//             }
//         }

//         if (token != null) {
//             String username = jwtUtil.extractUsername(token);
//             UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//             UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null,
//                     userDetails.getAuthorities());
//             SecurityContextHolder.getContext().setAuthentication(auth);
//         }

//         filterChain.doFilter(request, response);
//     }
// }

package com.mgaye.moneytransfer.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.mgaye.moneytransfer.entity.User;
import com.mgaye.moneytransfer.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Slf4j
@Component
public class JwtFilter extends OncePerRequestFilter {

    Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String token = null;

        // Extract JWT from cookies
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                logger.info("🍪 Found cookie: {}", cookie.getName());
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    logger.info("🔑 Length of the JWT Token extracted from cookie: {}" + token.length());
                    break;
                }
            }
        }

        if (token != null) {

      
            try {
                String username = jwtUtil.extractUsername(token);
                logger.info("👤 Extracted username from JWT: {}", username);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    if (jwtUtil.validateToken(token, userDetails)) {
                        log.info("✅ JWT token is valid");
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                        SecurityContextHolder.getContext().setAuthentication(auth);
                        log.info("🎯 SPRING SECURITY CONTEXT SET - User is now authenticated: {}",
                                auth.isAuthenticated());

                        filterChain.doFilter(request, response);

                    } else {
                        log.warn("❌ JWT token validation failed");

                    }
                }
            } catch (Exception e) {
                // Optionally log invalid/expired token
                logger.warn("JWT validation failed: {}", e.getMessage());
            }
        }

        // if (token != null) {

        // String username = jwtUtil.extractUsername(token);
        // try {
        // if (username != null &&
        // SecurityContextHolder.getContext().getAuthentication() == null) {
        // UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        // if (jwtUtil.validateToken(token, userDetails)) {
        // UsernamePasswordAuthenticationToken auth = new
        // UsernamePasswordAuthenticationToken(
        // userDetails,
        // null,
        // userDetails.getAuthorities());
        // SecurityContextHolder.getContext().setAuthentication(auth);
        // }
        // }
        // } catch (Exception e) {
        // // TODO: handle exception
        // log.warn("JwtAuthentication failed")
        // }
        // }

        // Check what we have after processing
        Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
        log.info("🔍 After JWT filter - Authentication: {}",
                currentAuth != null ? currentAuth.getName() + " (authenticated: " + currentAuth.isAuthenticated() + ")"
                        : "NULL");

        filterChain.doFilter(request, response);
    }
}

// @Component
// public class JwtFilter extends OncePerRequestFilter {

// @Autowired
// private JwtUtil jwtUtil;

// @Autowired
// private UserService userService;

// @Override
// protected void doFilterInternal(HttpServletRequest request,
// HttpServletResponse response,
// FilterChain filterChain)
// throws ServletException, IOException {

// // 1. Extract JWT from cookie
// String jwt = extractJwtFromCookie(request);

// // 2. Validate JWT
// if (jwt != null && jwtUtil.validateToken(jwt)) {
// try {
// String email = jwtUtil.extractUsername(jwt);
// User user = userService.getByEmail(email);

// // Create authentication token
// UsernamePasswordAuthenticationToken authentication =
// new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
// authentication.setDetails(new
// WebAuthenticationDetailsSource().buildDetails(request));

// // Set authentication in security context
// SecurityContextHolder.getContext().setAuthentication(authentication);

// } catch (Exception e) {
// logger.warn("JWT authentication failed", e);
// // Clear the invalid cookie
// clearInvalidJwtCookie(response);
// }
// }

// filterChain.doFilter(request, response);
// }

// private String extractJwtFromCookie(HttpServletRequest request) {
// if (request.getCookies() != null) {
// for (Cookie cookie : request.getCookies()) {
// if ("jwt".equals(cookie.getName())) {
// return cookie.getValue();
// }
// }
// }
// return null;
// }

// private void clearInvalidJwtCookie(HttpServletResponse response) {
// Cookie cookie = new Cookie("jwt", "");
// cookie.setHttpOnly(true);
// cookie.setPath("/");
// cookie.setMaxAge(0); // Expire immediately
// response.addCookie(cookie);
// }
// }