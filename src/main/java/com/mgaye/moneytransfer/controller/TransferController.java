package com.mgaye.moneytransfer.controller;

import com.mgaye.moneytransfer.dto.response.TransferResponseDto;
import com.mgaye.moneytransfer.dto.request.TransferRequestDto;
import com.mgaye.moneytransfer.entity.Transfer;
import com.mgaye.moneytransfer.entity.User;
import com.mgaye.moneytransfer.service.TransferService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api")
// public class TransferController {

//     private final TransferService transferService;

//     public TransferController(TransferService transferService) {
//         this.transferService = transferService;
//     }

//     @PostMapping("/transfers")
//     public ResponseEntity<Transfer> createTransfer(@RequestBody TransferRequestDto request) {
//         Transfer transfer = transferService.createTransfer(
//                 request.getFromUserId(),
//                 request.getToUserId(),
//                 request.getBeneficiaryId(),
//                 request.getAmount());
//         return ResponseEntity.ok(transfer);
//     }

//     // @GetMapping("/users/{id}")
//     // public ResponseEntity<Optional<User>> getUser(@PathVariable Long id) {
//     // return ResponseEntity.ok(transferService.getUser(id));
//     // }

//     @GetMapping("/transfers/user/{id}")

//     public ResponseEntity<List<Transfer>> getTransfersByUser(@PathVariable Long id) {
//         return ResponseEntity.ok(transferService.getUserTransfers(id));
//     }
// }

import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    // ✅ Créer un transfert (interne ou externe)
    @PostMapping
    public Transfer createTransfer(@RequestBody TransferRequestDto request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be greater than zero");
        }

        if (request.getToUserId() == null && request.getBeneficiaryId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Either toUserId or beneficiaryId must be provided");
        }

        try {
            return transferService.createTransfer(
                    request.getFromUserId(),
                    request.getToUserId(),
                    request.getBeneficiaryId(),
                    request.getAmount());
        } catch (RuntimeException e) {
            // Toutes les exceptions du service sont transformées en 400 ou 409
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    // ✅ Récupérer tous les transferts d’un utilisateur
    @GetMapping("/user/{userId}")
    public List<Transfer> getUserTransfers(@PathVariable Long userId) {
        return transferService.getUserTransfers(userId);
    }
}
