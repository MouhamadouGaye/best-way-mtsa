package com.mgaye.moneytransfer.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mgaye.moneytransfer.dto.CountryCodeEntry;

import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;

@Service
public class CountryCodeService {

    private List<CountryCodeEntry> codes;

    @PostConstruct
    public void loadCountryCodes() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getResourceAsStream("/country-codes.json");
            if (is == null) {
                throw new RuntimeException("country-codes.json not found in resources!");
            }
            codes = mapper.readValue(is, new TypeReference<List<CountryCodeEntry>>() {
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to load country codes", e);
        }
    }

    public String extractCountryCode(String phoneNumber) {
        if (phoneNumber == null)
            return "INTL";

        String normalized = phoneNumber.replaceAll("\\s+", "").replaceAll("-", "");

        Optional<CountryCodeEntry> match = codes.stream()
                .filter(c -> normalized.startsWith(c.getPrefix()))
                .findFirst();

        return match.map(CountryCodeEntry::getPrefix).orElse("INTL");
    }

    public CountryCodeEntry getCountryByPrefix(String phoneNumber) {
        if (phoneNumber == null)
            return null;

        String normalized = phoneNumber.replaceAll("\\s+", "").replaceAll("-", "");
        return codes.stream()
                .filter(c -> normalized.startsWith(c.getPrefix()))
                .findFirst()
                .orElse(null);
    }

    public List<CountryCodeEntry> getAllCountryCodes() {
        return codes;
    }
}
