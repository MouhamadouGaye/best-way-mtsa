package com.mgaye.moneytransfer.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.mgaye.moneytransfer.dto.request.BeneficiaryDTO;
import com.mgaye.moneytransfer.dto.request.BeneficiaryRequest;
import com.mgaye.moneytransfer.entity.Beneficiary;
import com.mgaye.moneytransfer.entity.CountryCode;
import com.mgaye.moneytransfer.entity.User;
import com.mgaye.moneytransfer.repository.BeneficiaryRepository;
import com.mgaye.moneytransfer.repository.CountryCodeRepository;
import com.mgaye.moneytransfer.repository.UserRepository;
import com.mgaye.moneytransfer.service.CountryCodeService;

import lombok.RequiredArgsConstructor;

import java.security.Principal;
import java.util.List;

// @RestController
// @RequestMapping("/api/beneficiaries")
// @RequiredArgsConstructor
// public class BeneficiaryController {

//     private final BeneficiaryRepository beneficiaryRepository;
//     private final CountryCodeService countryCodeService; // use the service
//     private final UserRepository userRepository;

//     // ✅ Create new beneficiary
//     @PostMapping
//     @PreAuthorize("isAuthenticated()")
//     public Beneficiary createBeneficiary(@RequestBody BeneficiaryRequest request,
//             Principal principal) {

//         if (request.getFullName() == null || request.getPhoneNumber() == null) {
//             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Full name and phone number are required");
//         }

//         String countryCode = countryCodeService.extractCountryCode(request.getPhoneNumber());
//         if (countryCode.equals("INTL")) {
//             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported phone prefix");
//         }

//         if (beneficiaryRepository.existsByPhoneNumber(request.getPhoneNumber())) {
//             throw new ResponseStatusException(HttpStatus.CONFLICT, "This beneficiary already exists");
//         }

//         // ✅ attach current user
//         User owner = userRepository.findByEmail(principal.getName())
//                 .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

//         Beneficiary beneficiary = Beneficiary.builder()
//                 .fullName(request.getFullName())
//                 .phoneNumber(request.getPhoneNumber())
//                 .email(request.getEmail())
//                 .countryCode(countryCode)
//                 .owner(owner) // <-- important
//                 .build();

//         return beneficiaryRepository.save(beneficiary);
//     }

//     // ✅ Get all beneficiaries
//     @GetMapping
//     public List<Beneficiary> getAllBeneficiaries() {
//         return beneficiaryRepository.findAll();
//     }

//     // ✅ Get all beneficiaries for a specific user
//     @GetMapping("/user/{userId}")
//     public List<Beneficiary> getUserBeneficiaries(@PathVariable Long userId) {
//         return beneficiaryRepository.findByOwner_Id(userId);
//     }
// }

@RestController
@RequestMapping("/api/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryRepository beneficiaryRepository;
    private final CountryCodeService countryCodeService;
    private final UserRepository userRepository;

    // ✅ Create new beneficiary
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public BeneficiaryDTO createBeneficiary(@RequestBody BeneficiaryRequest request,
            Principal principal) {

        // 1. Validate request
        if (request.getFullName() == null || request.getPhoneNumber() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Full name and phone number are required");
        }

        // 2. Normalize & validate country code
        String countryCode = countryCodeService.extractCountryCode(request.getPhoneNumber());
        if ("INTL".equals(countryCode)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported phone prefix");
        }

        // 3. Find the logged-in user
        User owner = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // 4. Check duplicate only for this owner
        boolean exists = beneficiaryRepository.existsByPhoneNumberAndOwner(request.getPhoneNumber(), owner);
        if (exists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This beneficiary already exists");
        }

        // 5. Save
        Beneficiary beneficiary = Beneficiary.builder()
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .countryCode(countryCode)
                .owner(owner)
                .build();

        Beneficiary saved = beneficiaryRepository.save(beneficiary);

        // 6. Return DTO instead of entity
        return BeneficiaryDTO.from(saved);
    }

    // ✅ Get all beneficiaries for current user
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<BeneficiaryDTO> getMyBeneficiaries(Principal principal) {
        User owner = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        return beneficiaryRepository.findByOwner(owner).stream()
                .map(BeneficiaryDTO::from)
                .toList();
    }
}
