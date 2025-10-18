package com.mgaye.moneytransfer.service;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.mgaye.moneytransfer.annotation.Auditable;

@Aspect
@Component
public class AuditAspect {

    private final AuditService auditService;
    private final Auditable auditable;

    public AuditAspect(AuditService auditService, Auditable auditable) {
        this.auditService = auditService;
        this.auditable = auditable;
    }

    @Around("@annotation(auditable)")
    public Object auditMethod(ProceedingJoinPoint joinPoint, Auditable auditable) throws Throwable {
        Long userId = getCurrentUserId();
        String methodName = joinPoint.getSignature().getName();

        try {
            Object result = joinPoint.proceed();

            // Log successful execution
            auditService.logEvent(userId, auditable.action(),
                    auditable.description().isEmpty() ? "Method executed: " + methodName : auditable.description());

            return result;

        } catch (Exception e) {
            // Log failed execution
            auditService.logFailedAttempt(userId, auditable.action() + "_FAILED",
                    "Method failed: " + methodName + " - " + e.getMessage(),
                    getClientIp(), getUserAgent());
            throw e;
        }
    }

    private Long getCurrentUserId() {
        // Implement based on your security context
        return 1L; // Placeholder
    }

    private String getClientIp() {
        // Implement IP extraction
        return "unknown";
    }

    private String getUserAgent() {
        // Implement user agent extraction
        return "unknown";
    }
}