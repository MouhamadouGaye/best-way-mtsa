package com.mgaye.moneytransfer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mgaye.moneytransfer.entity.Card;

public interface CardRepository extends JpaRepository<Card, Long> {

    List<Card> findByUserId(Long userId);

}
