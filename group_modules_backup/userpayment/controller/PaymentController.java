package com.property.app.userpayment.controller;

import com.property.app.userpayment.dto.PaymentRequest;
import com.property.app.userpayment.dto.PaymentResponse;
import com.property.app.userpayment.model.Payment;
import com.property.app.userpayment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.processPayment(request));
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByBuyer(@PathVariable Long buyerId) {
        return ResponseEntity.ok(paymentService.getPaymentsByBuyerId(buyerId));
    }

    @GetMapping("/offer/{offerId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByOffer(@PathVariable Long offerId) {
        return ResponseEntity.ok(paymentService.getPaymentsByOfferId(offerId));
    }

    @GetMapping("/receipt/{receiptNumber}")
    public ResponseEntity<PaymentResponse> getByReceipt(@PathVariable String receiptNumber) {
        return ResponseEntity.ok(paymentService.getByReceiptNumber(receiptNumber));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PaymentResponse> updateStatus(@PathVariable Long id, @RequestParam Payment.Status status) {
        return ResponseEntity.ok(paymentService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
