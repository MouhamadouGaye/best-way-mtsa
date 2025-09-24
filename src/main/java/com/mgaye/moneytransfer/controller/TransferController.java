package com.mgaye.moneytransfer.controller;

import com.mgaye.moneytransfer.dto.response.TransferResponseDto;
import com.mgaye.moneytransfer.dto.TransferDTO;
import com.mgaye.moneytransfer.dto.request.TransferRequestDto;
import com.mgaye.moneytransfer.entity.Transfer;
import com.mgaye.moneytransfer.entity.User;
import com.mgaye.moneytransfer.repository.UserRepository;
import com.mgaye.moneytransfer.service.TransferService;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
public class TransferController {

    private final TransferService transferService;
    private final UserRepository userRepository;

    // // ✅ Create a new transfer (either to another user or to a beneficiary)
    // @PostMapping
    // @PreAuthorize("isAuthenticated()")
    // public TransferDTO createTransfer(@RequestBody TransferRequestDto request,
    // Principal principal) {

    // // 1. Validate amount
    // if (request.getAmount() == null ||
    // request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
    // throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be
    // greater than zero");
    // }

    // // 2. Validate recipient
    // if (request.getToUserId() == null && request.getBeneficiaryId() == null) {
    // throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
    // "Either toUserId or beneficiaryId must be provided");
    // }

    // // 3. Derive sender from authenticated principal (NEVER trust frontend)
    // User sender = userRepository.findByEmail(principal.getName())
    // .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User
    // not found"));

    // try {
    // // 4. Delegate to service
    // Transfer transfer = transferService.createTransfer(
    // sender.getId(),
    // request.getToUserId(),
    // request.getBeneficiaryId(),
    // request.getAmount());

    // // 5. Convert to DTO for response
    // return TransferDTO.from(transfer);

    // } catch (RuntimeException e) {
    // // Service-level validation errors
    // throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    // }
    // }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public TransferDTO createTransfer(@RequestBody TransferRequestDto request, Principal principal) {

        // 1. Validate the amount
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be greater than zero");
        }

        // 2. Ensure that at least one recipient is specified (internal user OR external
        // beneficiary)
        if (request.getToUserId() == null && request.getBeneficiaryId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Either toUserId or beneficiaryId must be provided");
        }

        // 3. Identify the sender from the authenticated principal (never trust frontend
        // IDs)
        User sender = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        try {
            // 4. Delegate to the service layer:
            // - Handles internal vs external transfers
            // - Applies "fromCard" logic (skip balance check if true)
            Transfer transfer = transferService.createTransfer(
                    sender.getId(),
                    request.getToUserId(),
                    request.getBeneficiaryId(),
                    request.getAmount(),
                    request.isFromCard() // <-- new flag to indicate card funding
            );

            // 5. Convert entity to DTO for the API response
            return TransferDTO.from(transfer);

        } catch (RuntimeException e) {
            // 6. Propagate service-level validation/business errors as HTTP 400
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // ✅ Get all transfers for current user
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<TransferDTO> getMyTransfers(Principal principal) {
        User current = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        return transferService.getUserTransfers(current.getId()).stream()
                .map(TransferDTO::from)
                .toList();
    }
}
