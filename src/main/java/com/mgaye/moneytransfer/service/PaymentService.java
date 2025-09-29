package com.mgaye.moneytransfer.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    // public boolean chargeCard(String paymentMethodId, String currency, long
    // amountInCents) {
    // try {
    // Map<String, Object> params = new HashMap<>();
    // params.put("amount", amountInCents); // Stripe requires cents
    // params.put("currency", currency); // e.g., "usd", "eur"
    // params.put("payment_method", paymentMethodId);
    // params.put("confirm", true);

    // PaymentIntent intent = PaymentIntent.create(params);

    // return "succeeded".equals(intent.getStatus());

    // } catch (StripeException e) {
    // e.printStackTrace();
    // return false;
    // }
    // } // Map pattern that does the same thing this builder pattern does below

    public boolean chargeCard(String paymentMethodId, String currency, long amountInCents) throws StripeException {

        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(currency)
                    .setPaymentMethod(paymentMethodId)
                    .setConfirm(true)
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            return "succeeded".equals(intent.getStatus());
        } catch (StripeException e) {
            // Log the exception or handle it as needed
            e.printStackTrace();
            throw e; // Rethrow the exception to be handled by the caller
        }

    }
}
