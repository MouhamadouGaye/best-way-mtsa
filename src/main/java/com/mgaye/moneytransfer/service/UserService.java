package com.mgaye.moneytransfer.service;

import com.mgaye.moneytransfer.entity.Card;
import com.mgaye.moneytransfer.entity.User;
import com.mgaye.moneytransfer.repository.CardRepository;
import com.mgaye.moneytransfer.repository.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentMethod;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentMethodAttachParams;

import jakarta.transaction.Transactional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.math.BigDecimal;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CardRepository cardRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, CardRepository carRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cardRepository = carRepository;
    }

    public boolean checkCredentials(String email, String rawPassword) {
        return userRepository.findByEmail(email)
                .map(user -> passwordEncoder.matches(rawPassword, user.getPassword()))
                .orElse(false);
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User createUser(String username, String email, String rawPassword, String phoneNumber) {
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .phoneNumber(phoneNumber)
                .balance(BigDecimal.ZERO)
                .createdAt(Instant.now())
                .build();
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("USER")
                .build();
    }

    /**
     * Attach a Stripe PaymentMethod to a user and store its details locally.
     * This ensures we can reuse the same card without asking the user again.
     */
    // @Transactional
    // public void attachPaymentMethod(Long userId, String paymentMethodId) throws
    // StripeException {
    // User user = userRepository.findById(userId)
    // .orElseThrow(() -> new RuntimeException("User not found"));

    // // 1️⃣ Ensure Stripe Customer exists
    // if (user.getStripeCustomerId() == null) {
    // Customer customer = Customer.create(
    // CustomerCreateParams.builder()
    // .setEmail(user.getEmail())
    // .build());
    // user.setStripeCustomerId(customer.getId());
    // userRepository.save(user);
    // }

    // // 2️⃣ Retrieve PaymentMethod
    // PaymentMethod pm = PaymentMethod.retrieve(paymentMethodId);
    // if (pm.getCard() == null) {
    // throw new IllegalStateException("Provided PaymentMethod is not a card");
    // }

    // // 3️⃣ Attach to Customer (so it can be reused!)
    // pm.attach(PaymentMethodAttachParams.builder()
    // .setCustomer(user.getStripeCustomerId())
    // .build());

    // // 4️⃣ Check if already stored in DB
    // Optional<Card> existingCard =
    // cardRepository.findByStripePaymentMethodId(paymentMethodId);
    // if (existingCard.isPresent()) {
    // return;
    // }

    // // 5️⃣ Save card in DB
    // Card card = new Card();
    // card.setUser(user);
    // card.setStripePaymentMethodId(pm.getId());
    // card.setBrand(pm.getCard().getBrand());
    // card.setLast4(pm.getCard().getLast4());
    // card.setExpMonth(pm.getCard().getExpMonth() != null ?
    // pm.getCard().getExpMonth().intValue() : null);
    // card.setExpYear(pm.getCard().getExpYear() != null ?
    // pm.getCard().getExpYear().intValue() : null);

    // boolean isFirstCard = cardRepository.findByUserId(userId).isEmpty();
    // card.setIsDefault(isFirstCard);

    // cardRepository.save(card);

    // // 6️⃣ Optionally mark default in User
    // if (isFirstCard || user.getStripePaymentMethodId() == null) {
    // user.setStripePaymentMethodId(pm.getId());
    // userRepository.save(user);
    // }
    // }

    @Transactional
    public void attachPaymentMethod(Long userId, String paymentMethodId) throws StripeException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 0️⃣ Ensure user has a Stripe Customer
        if (user.getStripeCustomerId() == null) {
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setEmail(user.getEmail())
                    .setName(user.getUsername())
                    .build();
            Customer customer = Customer.create(customerParams);
            user.setStripeCustomerId(customer.getId());
            userRepository.save(user);
        }

        // 1️⃣ Attach PaymentMethod to Stripe Customer
        PaymentMethod pm = PaymentMethod.retrieve(paymentMethodId);
        pm.attach(PaymentMethodAttachParams.builder()
                .setCustomer(user.getStripeCustomerId())
                .build());

        // 2️⃣ Save card info locally
        Optional<Card> existingCard = cardRepository.findByStripePaymentMethodId(paymentMethodId);

        if (existingCard.isPresent()) {
            return; // already stored, nothing to do
        }

        Card card = new Card();
        card.setUser(user);
        card.setStripePaymentMethodId(pm.getId());
        card.setBrand(pm.getCard().getBrand());
        card.setLast4(pm.getCard().getLast4());
        card.setExpMonth(pm.getCard().getExpMonth().intValue());
        card.setExpYear(pm.getCard().getExpYear().intValue());

        boolean isFirstCard = cardRepository.findByUserId(userId).isEmpty();
        card.setIsDefault(isFirstCard);
        cardRepository.save(card);

        if (isFirstCard || user.getStripePaymentMethodId() == null) {
            user.setStripePaymentMethodId(pm.getId());
            userRepository.save(user);
        }
    }

}
