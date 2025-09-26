package com.mgaye.moneytransfer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // store hashed in real app

    @Column(nullable = false, unique = true, length = 20)
    private String phoneNumber; // 📱 Added phone number

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "stripe_payment_method_id", unique = true)
    private String stripePaymentMethodId; // this was add for strype payment service

    // IDs to the transaction_entries table forming the user's linked list
    @Column(name = "head_entry_id")
    private Long headEntryId;

    @Column(name = "tail_entry_id")
    private Long tailEntryId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
