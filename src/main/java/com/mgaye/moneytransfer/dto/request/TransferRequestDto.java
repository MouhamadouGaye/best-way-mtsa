package com.mgaye.moneytransfer.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransferRequestDto {
    private Long fromUserId;
    private Long toUserId;
    private Long beneficiaryId; // optionnel
    private BigDecimal amount;
}
