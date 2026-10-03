package com.property.app.userpayment.dto;

import com.property.app.userpayment.model.Payment;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {

    private Long id;
    private Long offerId;
    private Long propertyId;
    private String propertyTitle;
    private Long buyerId;
    private String buyerName;
    private BigDecimal amount;
    private BigDecimal depositPercentage;
    private String paymentMethod;
    private String transactionRef;
    private String receiptNumber;
    private Payment.Status status;
    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;

    public PaymentResponse() {}

    public static PaymentResponse fromEntity(Payment p) {
        PaymentResponse r = new PaymentResponse();
        r.setId(p.getId());
        r.setOfferId(p.getOfferId());
        r.setPropertyId(p.getPropertyId());
        r.setPropertyTitle(p.getPropertyTitle());
        r.setBuyerId(p.getBuyerId());
        r.setBuyerName(p.getBuyerName());
        r.setAmount(p.getAmount());
        r.setDepositPercentage(p.getDepositPercentage());
        r.setPaymentMethod(p.getPaymentMethod());
        r.setTransactionRef(p.getTransactionRef());
        r.setReceiptNumber(p.getReceiptNumber());
        r.setStatus(p.getStatus());
        r.setPaymentDate(p.getPaymentDate());
        r.setCreatedAt(p.getCreatedAt());
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOfferId() { return offerId; }
    public void setOfferId(Long offerId) { this.offerId = offerId; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getPropertyTitle() { return propertyTitle; }
    public void setPropertyTitle(String propertyTitle) { this.propertyTitle = propertyTitle; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getDepositPercentage() { return depositPercentage; }
    public void setDepositPercentage(BigDecimal depositPercentage) { this.depositPercentage = depositPercentage; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public Payment.Status getStatus() { return status; }
    public void setStatus(Payment.Status status) { this.status = status; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
