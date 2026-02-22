package com.mgaye.moneytransfer;

import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = { "com.mgaye.moneytransfer", "com.mgaye.moneytransfer.config" })
public class MoneytransferApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoneytransferApplication.class, args);

	}

}
