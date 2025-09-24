package com.mgaye.moneytransfer.service;

import com.mgaye.moneytransfer.entity.*;
import com.mgaye.moneytransfer.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

// @Service
// public class TransferService {
//     private final UserRepository userRepository;
//     private final TransferRepository transferRepository;
//     private final TransactionEntryRepository entryRepository;
//     private final BeneficiaryRepository beneficiaryRepository;

//     public TransferService(UserRepository userRepository,
//             TransferRepository transferRepository,
//             TransactionEntryRepository entryRepository, BeneficiaryRepository beneficiaryRepository) {
//         this.userRepository = userRepository;
//         this.transferRepository = transferRepository;
//         this.entryRepository = entryRepository;
//         this.beneficiaryRepository = beneficiaryRepository;
//     }

//     public Optional<User> getUser(Long id) {
//         return userRepository.findById(id);
//     }

//     public List<Transfer> getUserTransfers(Long userId) {
//         return transferRepository.findByFromUser_IdOrToUser_Id(userId, userId);
//     }

//     @Transactional
//     public Transfer createTransfer(Long fromUserId, Long toUserId, Long beneficiaryId, BigDecimal amount) {
//         User fromUser = userRepository.findById(fromUserId)
//                 .orElseThrow(() -> new RuntimeException("Sender not found"));

//         if (fromUser.getBalance().compareTo(amount) < 0) {
//             throw new RuntimeException("Insufficient balance");
//         }

//         Transfer.TransferBuilder transferBuilder = Transfer.builder()
//                 .fromUser(fromUser)
//                 .amount(amount)
//                 .status(Transfer.TransferStatus.COMPLETED)
//                 .createdAt(Instant.now());

//         if (toUserId != null) {
//             // Cas interne
//             User toUser = userRepository.findById(toUserId)
//                     .orElseThrow(() -> new RuntimeException("Recipient not found"));

//             // debit / credit
//             fromUser.setBalance(fromUser.getBalance().subtract(amount));
//             toUser.setBalance(toUser.getBalance().add(amount));
//             userRepository.save(fromUser);
//             userRepository.save(toUser);

//             Transfer transfer = transferBuilder.toUser(toUser).build();
//             transferRepository.save(transfer);

//             // entries
//             addTransactionEntries(fromUser, toUser, transfer);

//             return transfer;

//         } else if (beneficiaryId != null) {
//             // Cas externe
//             Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
//                     .orElseThrow(() -> new RuntimeException("Beneficiary not found"));

//             // debit uniquement
//             fromUser.setBalance(fromUser.getBalance().subtract(amount));
//             userRepository.save(fromUser);

//             Transfer transfer = transferBuilder.beneficiary(beneficiary).build();
//             transferRepository.save(transfer);

//             // entry seulement pour le sender
//             addTransactionEntry(fromUser, transfer);

//             return transfer;
//         } else {
//             throw new IllegalArgumentException("Either toUserId or beneficiaryId must be provided");
//         }
//     }

//     private void addTransactionEntries(User fromUser, User toUser, Transfer transfer) {
//         TransactionEntry fromEntry = TransactionEntry.builder()
//                 .user(fromUser)
//                 .transfer(transfer)
//                 .createdAt(Instant.now())
//                 .prevEntryId(fromUser.getTailEntryId())
//                 .build();
//         entryRepository.save(fromEntry);

//         TransactionEntry toEntry = TransactionEntry.builder()
//                 .user(toUser)
//                 .transfer(transfer)
//                 .createdAt(Instant.now())
//                 .prevEntryId(toUser.getTailEntryId())
//                 .build();
//         entryRepository.save(toEntry);

//         updateUserPointers(fromUser, fromEntry);
//         updateUserPointers(toUser, toEntry);
//     }

//     private void addTransactionEntry(User user, Transfer transfer) {
//         TransactionEntry entry = TransactionEntry.builder()
//                 .user(user)
//                 .transfer(transfer)
//                 .createdAt(Instant.now())
//                 .prevEntryId(user.getTailEntryId())
//                 .build();
//         entryRepository.save(entry);
//         updateUserPointers(user, entry);
//     }

//     private void updateUserPointers(User user, TransactionEntry entry) {
//         user.setTailEntryId(entry.getId());
//         if (user.getHeadEntryId() == null) {
//             user.setHeadEntryId(entry.getId());
//         }
//         userRepository.save(user);
//     }

// }

@Service
public class TransferService {
    private final UserRepository userRepository;
    private final TransferRepository transferRepository;
    private final TransactionEntryRepository entryRepository;
    private final BeneficiaryRepository beneficiaryRepository;

    public TransferService(UserRepository userRepository,
            TransferRepository transferRepository,
            TransactionEntryRepository entryRepository,
            BeneficiaryRepository beneficiaryRepository) {
        this.userRepository = userRepository;
        this.transferRepository = transferRepository;
        this.entryRepository = entryRepository;
        this.beneficiaryRepository = beneficiaryRepository;
    }

    // @Transactional
    // public Transfer createTransfer(Long fromUserId, Long toUserId, Long
    // beneficiaryId, BigDecimal amount) {
    // User fromUser = userRepository.findById(fromUserId)
    // .orElseThrow(() -> new RuntimeException("Sender not found"));

    // if (fromUser.getBalance().compareTo(amount) < 0) {
    // throw new RuntimeException("Insufficient balance");
    // }

    // // 🔴 Conflict: insufficient funds
    // if (fromUser.getBalance().compareTo(amount) < 0) {
    // throw new IllegalStateException("Insufficient balance");
    // }

    // Transfer.TransferBuilder transferBuilder = Transfer.builder()
    // .fromUser(fromUser)
    // .amount(amount)
    // .status(Transfer.TransferStatus.COMPLETED)
    // .createdAt(Instant.now());

    // if (toUserId != null) {
    // // ✅ Cas 1 : Transfert interne (User → User)
    // // User toUser = userRepository.findById(toUserId)
    // // .orElseThrow(() -> new RuntimeException("Recipient not found"));

    // // ✅ Case 1: Internal transfer (User → User)
    // User toUser = userRepository.findById(toUserId)
    // .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));

    // // Débit / Crédit
    // fromUser.setBalance(fromUser.getBalance().subtract(amount));
    // toUser.setBalance(toUser.getBalance().add(amount));
    // userRepository.save(fromUser);
    // userRepository.save(toUser);

    // Transfer transfer = transferBuilder.toUser(toUser).build();
    // transferRepository.save(transfer);

    // // Créer les deux entries (expéditeur + destinataire)
    // addTransactionEntries(fromUser, toUser, transfer);

    // return transfer;

    // } else if (beneficiaryId != null) {
    // // ✅ Cas 2 : Transfert externe (User → Beneficiary)
    // // Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
    // // .orElseThrow(() -> new RuntimeException("Beneficiary not found"));
    // Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
    // .orElseThrow(() -> new IllegalArgumentException("Beneficiary not found"));

    // // Débit uniquement
    // fromUser.setBalance(fromUser.getBalance().subtract(amount));
    // userRepository.save(fromUser);

    // Transfer transfer = transferBuilder.beneficiary(beneficiary).build();
    // transferRepository.save(transfer);

    // // Créer une entry uniquement pour le sender
    // addTransactionEntry(fromUser, transfer);

    // return transfer;
    // } else {
    // throw new IllegalArgumentException("Either toUserId or beneficiaryId must be
    // provided");
    // }
    // }

    @Transactional
    public Transfer createTransfer(
            Long fromUserId,
            Long toUserId,
            Long beneficiaryId,
            BigDecimal amount,
            boolean fromCard) {

        User fromUser = userRepository.findById(fromUserId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        // Only check balance if NOT using card
        if (!fromCard && fromUser.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        Transfer.TransferBuilder transferBuilder = Transfer.builder()
                .fromUser(fromUser)
                .amount(amount)
                .status(Transfer.TransferStatus.COMPLETED)
                .createdAt(Instant.now());

        if (toUserId != null) {
            // -------------------------
            // Internal transfer
            // -------------------------
            User toUser = userRepository.findById(toUserId)
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));

            if (!fromCard) {
                fromUser.setBalance(fromUser.getBalance().subtract(amount));
                toUser.setBalance(toUser.getBalance().add(amount));
                userRepository.save(fromUser);
                userRepository.save(toUser);
            }

            Transfer transfer = transferBuilder
                    .toUser(toUser) // ✅ set internal recipient
                    .beneficiary(null) // ✅ make sure beneficiary is null
                    .build();

            transferRepository.save(transfer);

            if (!fromCard) {
                addTransactionEntries(fromUser, toUser, transfer);
            }

            return transfer;

        } else if (beneficiaryId != null) {
            // -------------------------
            // External transfer
            // -------------------------
            Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
                    .orElseThrow(() -> new RuntimeException("Beneficiary not found"));

            if (!fromCard) {
                fromUser.setBalance(fromUser.getBalance().subtract(amount));
                userRepository.save(fromUser);
            }

            Transfer transfer = transferBuilder
                    .toUser(null) // ✅ clear toUser
                    .beneficiary(beneficiary)
                    .build();

            transferRepository.save(transfer);

            if (!fromCard) {
                addTransactionEntry(fromUser, transfer);
            }

            return transfer;

        } else {
            throw new IllegalArgumentException("Either toUserId or beneficiaryId must be provided");
        }
    }

    public List<Transfer> getUserTransfers(Long userId) {
        return transferRepository.findByFromUser_IdOrToUser_Id(userId, userId);
    }

    // 🔹 Crée une transaction entry pour un utilisateur
    private void addTransactionEntry(User user, Transfer transfer) {
        TransactionEntry entry = TransactionEntry.builder()
                .user(user)
                .transfer(transfer)
                .createdAt(Instant.now())
                .prevEntryId(user.getTailEntryId())
                .build();
        entryRepository.save(entry);

        // mise à jour du linked list
        user.setTailEntryId(entry.getId());
        if (user.getHeadEntryId() == null) {
            user.setHeadEntryId(entry.getId());
        }
        userRepository.save(user);
    }

    // 🔹 Crée les deux entries (expéditeur + destinataire)
    private void addTransactionEntries(User fromUser, User toUser, Transfer transfer) {
        addTransactionEntry(fromUser, transfer);
        addTransactionEntry(toUser, transfer);
    }
}
