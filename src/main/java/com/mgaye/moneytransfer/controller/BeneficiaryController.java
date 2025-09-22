package com.mgaye.moneytransfer.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.mgaye.moneytransfer.dto.request.BeneficiaryRequest;
import com.mgaye.moneytransfer.entity.Beneficiary;
import com.mgaye.moneytransfer.entity.CountryCode;
import com.mgaye.moneytransfer.entity.User;
import com.mgaye.moneytransfer.repository.BeneficiaryRepository;
import com.mgaye.moneytransfer.repository.CountryCodeRepository;
import com.mgaye.moneytransfer.repository.UserRepository;
import com.mgaye.moneytransfer.service.CountryCodeService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryRepository beneficiaryRepository;
    private final CountryCodeService countryCodeService; // use the service

    // ✅ Create new beneficiary
    @PostMapping
    public Beneficiary createBeneficiary(@RequestBody BeneficiaryRequest request) {
        // Check required fields
        if (request.getFullName() == null || request.getPhoneNumber() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Full name and phone number are required");
        }

        // Extract country code from phone prefix using the service
        String countryCode = countryCodeService.extractCountryCode(request.getPhoneNumber());
        if (countryCode.equals("INTL")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported phone prefix");
        }

        // Check for duplicate phone numbers
        if (beneficiaryRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This beneficiary already exists");
        }

        // Build and save beneficiary
        Beneficiary beneficiary = Beneficiary.builder()
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .countryCode(countryCode)
                .build();

        return beneficiaryRepository.save(beneficiary);
    }

    // ✅ Get all beneficiaries
    @GetMapping
    public List<Beneficiary> getAllBeneficiaries() {
        return beneficiaryRepository.findAll();
    }

    // ✅ Get all beneficiaries for a specific user
    @GetMapping("/user/{userId}")
    public List<Beneficiary> getUserBeneficiaries(@PathVariable Long userId) {
        return beneficiaryRepository.findByOwner_Id(userId);
    }
}
