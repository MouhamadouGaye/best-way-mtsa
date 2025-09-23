package com.mgaye.moneytransfer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mgaye.moneytransfer.entity.Beneficiary;
import com.mgaye.moneytransfer.entity.User;

@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    // boolean existsByPhoneNumber(String phoneNumber);

    // // Optional: find by phone number
    // Beneficiary findByPhoneNumber(String phoneNumber);

    // List<Beneficiary> findByOwner_Id(Long ownerId);

    boolean existsByPhoneNumberAndOwner(String phoneNumber, User owner);

    List<Beneficiary> findByOwner(User owner);

}
