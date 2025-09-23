package com.mgaye.moneytransfer.dto.request;

import com.mgaye.moneytransfer.entity.Beneficiary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BeneficiaryDTO {
    private Long id;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String countryCode;

    public static BeneficiaryDTO from(Beneficiary entity) {
        return BeneficiaryDTO.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .phoneNumber(entity.getPhoneNumber())
                .email(entity.getEmail())
                .countryCode(entity.getCountryCode())
                .build();
    }
}
