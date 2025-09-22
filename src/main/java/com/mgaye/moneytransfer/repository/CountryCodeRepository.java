package com.mgaye.moneytransfer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mgaye.moneytransfer.entity.CountryCode;

public interface CountryCodeRepository extends JpaRepository<CountryCode, Long> {
    CountryCode findByPrefix(String prefix);

    CountryCode findByCode(String code);
}
