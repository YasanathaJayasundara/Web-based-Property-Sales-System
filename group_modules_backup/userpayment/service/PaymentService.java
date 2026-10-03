package com.property.app.userpayment.service;

import com.property.app.userpayment.dto.PaymentRequest;
import com.property.app.userpayment.dto.PaymentResponse;
import com.property.app.userpayment.model.Payment;
import com.property.app.userpayment.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public PaymentResponse processPayment(PaymentRequest req) {
        Payment payment = new Payment();
        payment.setOfferId(req.getOfferId());
        payment.setPropertyId(req.getPropertyId());
        payment.setPropertyTitle(req.getPropertyTitle());
        payment.setBuyerId(req.getBuyerId());
        payment.setBuyerName(req.getBuyerName());
        payment.setAmount(req.getAmount());
        payment.setDepositPercentage(req.getDepositPercentage() != null ? req.getDepositPercentage() : new java.math.BigDecimal("10.00"));
        payment.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "SANDBOX");

        String txId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String rcptId = "RCPT-" + (1000 + (int)(Math.random() * 9000));
        payment.setTransactionRef(txId);
        payment.setReceiptNumber(rcptId);
        payment.setStatus(Payment.Status.COMPLETED);
        payment.setPaymentDate(LocalDateTime.now());

        Payment saved = paymentRepository.save(payment);
        return PaymentResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with id: " + id));
        return PaymentResponse.fromEntity(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByBuyerId(Long buyerId) {
        return paymentRepository.findByBuyerId(buyerId).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByOfferId(Long offerId) {
        return paymentRepository.findByOfferId(offerId).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaymentResponse getByReceiptNumber(String receiptNumber) {
        Payment payment = paymentRepository.findByReceiptNumber(receiptNumber)
                .orElseThrow(() -> new IllegalArgumentException("Payment receipt not found: " + receiptNumber));
        return PaymentResponse.fromEntity(payment);
    }

    public PaymentResponse updateStatus(Long id, Payment.Status status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with id: " + id));
        payment.setStatus(status);
        return PaymentResponse.fromEntity(paymentRepository.save(payment));
    }

    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new IllegalArgumentException("Payment not found with id: " + id);
        }
        paymentRepository.deleteById(id);
    }
}
