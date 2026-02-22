package com.mgaye.moneytransfer.config;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.expression.spel.ast.QualifiedIdentifier;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.mgaye.moneytransfer.security.CustomUserDetailsService;
import com.mgaye.moneytransfer.security.JwtFilter;
import com.mgaye.moneytransfer.security.JwtUtil;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {
// private final JwtFilter jwtFilter;

// public SecurityConfig(JwtFilter jwtFilter) {
// this.jwtFilter = jwtFilter;
// }

// @Bean
// public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
// Exception {
// http.csrf().disable()
// .authorizeHttpRequests(auth -> auth
// .requestMatchers("/api/users/register", "/api/auth/login").permitAll()
// .anyRequest().authenticated())
// .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

// http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
// return http.build();
// }

// @Bean
// public PasswordEncoder passwordEncoder() {
// return new BCryptPasswordEncoder();
// }
// }

@Configuration
public class SecurityConfig {

        private final JwtUtil jwtUtil;
        private final CustomUserDetailsService userDetailsService;

        @Value("${cors.allowed-origins}")
        private String corsAllowedOrigins;

        public SecurityConfig(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
                this.jwtUtil = jwtUtil;
                this.userDetailsService = userDetailsService;
        }

        @Bean
        public JwtFilter jwtFilter() {
                return new JwtFilter(jwtUtil, userDetailsService);
        }

        // @Bean
        // public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
        // Exception {
        // http.csrf(csrf -> csrf
        // // Disable CSRF for public endpoints (or configure properly)
        // .ignoringRequestMatchers("/api/users/verify-email", "/verify-email"))
        // .cors(cors -> cors.configurationSource(corsConfigurationSource())) // <---
        // apply CORS
        // .authorizeHttpRequests(auth -> auth
        // .requestMatchers("/api/users/register", "/api/auth/login",
        // "/api/users/simple-test",
        // "/api/users/verif-email")
        // .permitAll()
        // // Allow access to static resources (CSS, JS, images)
        // .requestMatchers("/css/**", "/js/**", "/ts/**", "/images/**").permitAll()
        // .anyRequest().authenticated())
        // .sessionManagement()
        // .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // http.addFilterBefore(jwtFilter(),
        // UsernamePasswordAuthenticationFilter.class);
        // return http.build();
        // }

        // @Bean
        // public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
        // Exception {
        // http
        // .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        // .csrf(csrf -> csrf
        // // Disable CSRF for public endpoints
        // .ignoringRequestMatchers(
        // "swagger-ui/**",
        // "v3/api-docs/**",
        // "/api/beneficiaries",
        // "/api/users/register",
        // "/api/users/me",
        // "/api/auth/login",
        // "/api/users/verify-email",
        // "/api/users/verify-email-page",
        // "/api/users/test-simple"))
        // .authorizeHttpRequests(auth -> auth
        // .requestMatchers(
        // "swagger-ui/**",
        // "v3/api-docs/**",
        // "/api/beneficiaries",
        // "/api/users/register",
        // "/api/users/me",
        // "/api/auth/login",
        // "/api/users/verify-email",
        // "/api/users/verify-email-page",
        // "/api/users/simple-test",
        // "/test-simple",
        // "/template-test")
        // .permitAll()
        // // Allow access to static resources
        // .requestMatchers("/css/**", "/js/**", "/ts/**", "/images/**")
        // .permitAll()
        // .anyRequest().authenticated())
        // .sessionManagement(session -> session
        // .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // http.addFilterBefore(jwtFilter(),
        // UsernamePasswordAuthenticationFilter.class);
        // return http.build();
        // }

        // @Bean
        // public CorsConfigurationSource corsConfigurationSource() {
        // CorsConfiguration configuration = new CorsConfiguration();
        // // Angular frontend origin
        // configuration.setAllowedOriginPatterns(
        // Arrays.asList("http://172.20.10.6:4200",
        // "http://localhost:5000"));
        // // HTTP methods your frontend will call
        // configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE",
        // "OPTIONS"));

        // // Allow all headers
        // configuration.setAllowedHeaders(Arrays.asList("*"));

        // // VERY IMPORTANT: allow cookies/credentials
        // configuration.setAllowCredentials(true);

        // UrlBasedCorsConfigurationSource source = new
        // UrlBasedCorsConfigurationSource();
        // source.registerCorsConfiguration("/**", configuration);
        // return source;
        // }

        // @Bean
        // public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
        // Exception {
        // http
        // .cors(cors -> cors.configurationSource(corsConfigurationSource())) // This
        // should come
        // // before CSRF
        // .csrf(csrf -> csrf
        // .ignoringRequestMatchers(
        // "/api/beneficiaries",
        // "/api/users/register",
        // "/api/users/me",
        // "/api/auth/login",
        // "/api/users/verify-email",
        // "/api/users/verify-email-page",
        // "/api/users/simple-test",
        // "/test-simple",
        // "/template-test",
        // "/swagger-ui/**",
        // "/v3/api-docs/**"))
        // .authorizeHttpRequests(auth -> auth
        // .requestMatchers(
        // "/api/beneficiaries",
        // "/api/users/register",
        // "/api/users/me",
        // "/api/auth/login",
        // "/api/users/verify-email",
        // "/api/users/verify-email-page",
        // "/api/users/simple-test",
        // "/test-simple",
        // "/template-test",
        // "/swagger-ui/**",
        // "/v3/api-docs/**",
        // "/css/**",
        // "/js/**",
        // "/ts/**",
        // "/images/**")
        // .permitAll()
        // .anyRequest().authenticated())
        // .sessionManagement(session -> session
        // .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // http.addFilterBefore(jwtFilter(),
        // UsernamePasswordAuthenticationFilter.class);

        // return http.build();
        // }

        // @Bean
        // public CorsConfigurationSource corsConfigurationSource() {
        // CorsConfiguration configuration = new CorsConfiguration();

        // // Add your specific origins
        // configuration.setAllowedOrigins(Arrays.asList(
        // "http://172.20.10.6:4200",
        // "http://localhost:5000",
        // "http://localhost:4200")); // Add localhost:4200 if testing locally

        // // Allow these HTTP methods
        // configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE",
        // "OPTIONS", "PATCH"));

        // // Allow these headers (specify explicitly for better security)
        // configuration.setAllowedHeaders(Arrays.asList(
        // "Authorization",
        // "Content-Type",
        // "X-Requested-With",
        // "Accept",
        // "Origin",
        // "Access-Control-Request-Method",
        // "Access-Control-Request-Headers"));

        // // Expose these headers if needed
        // configuration.setExposedHeaders(Arrays.asList(
        // "Access-Control-Allow-Origin",
        // "Access-Control-Allow-Credentials",
        // "Authorization"));

        // // Allow credentials
        // configuration.setAllowCredentials(true);

        // // Set max age for preflight cache
        // configuration.setMaxAge(3600L);

        // UrlBasedCorsConfigurationSource source = new
        // UrlBasedCorsConfigurationSource();
        // source.registerCorsConfiguration("/**", configuration);

        // return source;
        // }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .requestMatchers(
                                                                "/api/users/**",
                                                                "/api/auth/**",
                                                                "/api/beneficiaries",
                                                                "/swagger-ui/**",
                                                                "/v3/api-docs/**")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                // Allow Docker container origins
                configuration.setAllowedOrigins(Arrays.asList(
                                "http://frontend:80", // From Angular container (nginx on port 80)
                                "http://frontend:4200", // Alternative if running dev server
                                "http://localhost:4200", // From browser during development
                                "http://localhost:80" // If accessing via nginx on host
                ));

                configuration.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

                configuration.setAllowedHeaders(Arrays.asList(
                                "Authorization",
                                "Content-Type",
                                "X-Requested-With",
                                "Accept",
                                "Origin",
                                "Access-Control-Request-Method",
                                "Access-Control-Request-Headers"));

                configuration.setExposedHeaders(Arrays.asList(
                                "Access-Control-Allow-Origin",
                                "Access-Control-Allow-Credentials",
                                "Authorization"));

                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        // @Bean
        // public CorsConfigurationSource corsConfigurationSource() {
        // CorsConfiguration configuration = new CorsConfiguration();

        // // Expo / web development origins
        // configuration.setAllowedOriginPatterns(Arrays.asList(
        // "http://localhost:19006", // Expo web
        // "http://192.168.1.100:19006", // web on LAN
        // "exp://192.168.1.100:8081" // Expo Go / device

        // ));

        // // HTTP methods your frontend will call
        // configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE",
        // "OPTIONS"));

        // // Allow all headers
        // configuration.setAllowedHeaders(Arrays.asList("*"));

        // // Allow cookies/credentials
        // configuration.setAllowCredentials(true);

        // UrlBasedCorsConfigurationSource source = new
        // UrlBasedCorsConfigurationSource();
        // source.registerCorsConfiguration("/**", configuration);
        // return source;
        // }

}
// curl -H "Origin: http://172.20.10.6:4200" \
// -H "Access-Control-Request-Method: POST" \
// -H "Access-Control-Request-Headers: Content-Type" \
// -X OPTIONS \
// --verbose \
// http://172.20.10.6:8080/api/users/register
