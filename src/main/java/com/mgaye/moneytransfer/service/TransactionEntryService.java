package com.mgaye.moneytransfer.service;

import com.mgaye.moneytransfer.entity.TransactionEntry;
import com.mgaye.moneytransfer.entity.Transfer;
import com.mgaye.moneytransfer.entity.User;
import com.mgaye.moneytransfer.repository.TransactionEntryRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

@Service
public class TransactionEntryService {
    private final TransactionEntryRepository entryRepository;

    public TransactionEntryService(TransactionEntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    public Optional<TransactionEntry> findById(Long id) {
        return entryRepository.findById(id);
    }

    public Optional<TransactionEntry> findUserHead(Long userId) {
        return entryRepository.findFirstByUserIdAndPrevEntryIdIsNull(userId);
    }

    public Optional<TransactionEntry> findUserTail(Long userId) {
        return entryRepository.findFirstByUserIdAndNextEntryIdIsNull(userId);
    }

    /**
     * Add transaction entries for internal transfers (wallet or card).
     * For card payments, the sender's wallet stays unchanged but we still create a
     * debit entry with amount zero.
     */
    @Transactional
    public void addTransactionEntries(User fromUser, User toUser, Transfer transfer, boolean fromCard) {
        // Debit entry for sender
        TransactionEntry debitEntry = TransactionEntry.builder()
                .user(fromUser)
                .transfer(transfer)
                .amount(fromCard ? BigDecimal.ZERO : transfer.getAmount().negate())
                .balanceAfter(fromUser.getBalance()) // card payments: balance unchanged
                .createdAt(Instant.now())
                .build();
        entryRepository.save(debitEntry);

        // Credit entry for recipient (internal user)
        if (toUser != null) {
            TransactionEntry creditEntry = TransactionEntry.builder()
                    .user(toUser)
                    .transfer(transfer)
                    .amount(transfer.getAmount())
                    .balanceAfter(toUser.getBalance())
                    .createdAt(Instant.now())
                    .build();
            entryRepository.save(creditEntry);
        }
    }

    /**
     * Add a transaction entry for external transfers (beneficiary).
     * The sender's wallet is affected only if not using card.
     */
    @Transactional
    public void addTransactionEntry(User fromUser, Transfer transfer, boolean fromCard) {
        TransactionEntry entry = TransactionEntry.builder()
                .user(fromUser)
                .transfer(transfer)
                .amount(fromCard ? BigDecimal.ZERO : transfer.getAmount().negate())
                .balanceAfter(fromUser.getBalance())
                .createdAt(Instant.now())
                .build();
        entryRepository.save(entry);
    }
}
