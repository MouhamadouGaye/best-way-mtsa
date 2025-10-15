package com.mgaye.moneytransfer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mgaye.moneytransfer.entity.Card;

public interface CardRepository extends JpaRepository<Card, Long> {

    // 🔎 Find by Stripe PaymentMethod ID
    Optional<Card> findByStripePaymentMethodId(String stripePaymentMethodId);

    // 🔎 Get all cards of a user
    List<Card> findByUserId(Long userId);

    // 🔎 Find the default card for a user
    Optional<Card> findByUserIdAndIsDefaultTrue(Long userId);

}
