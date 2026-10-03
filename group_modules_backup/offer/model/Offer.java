package com.property.app.offer.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "offers")
public class Offer {

    public enum Status {
        PENDING,
        ACCEPTED,
        REJECTED,
        COUNTERED,
        WITHDRAWN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @Column(name = "property_title", nullable = false, length = 150)
    private String propertyTitle;

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    @Column(name = "buyer_name", nullable = false, length = 100)
    private String buyerName;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "offer_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal offerAmount;

    @Column(name = "counter_amount", precision = 14, scale = 2)
    private BigDecimal counterAmount;

    @Column(name = "initial_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal initialAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.PENDING;

    @Column(length = 1000)
    private String message;

    @Column(name = "counter_message", length = 1000)
    private String counterMessage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Offer() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = Status.PENDING;
        if (this.initialAmount == null) this.initialAmount = this.offerAmount;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getPropertyTitle() { return propertyTitle; }
    public void setPropertyTitle(String propertyTitle) { this.propertyTitle = propertyTitle; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public BigDecimal getOfferAmount() { return offerAmount; }
    public void setOfferAmount(BigDecimal offerAmount) { this.offerAmount = offerAmount; }

    public BigDecimal getCounterAmount() { return counterAmount; }
    public void setCounterAmount(BigDecimal counterAmount) { this.counterAmount = counterAmount; }

    public BigDecimal getInitialAmount() { return initialAmount; }
    public void setInitialAmount(BigDecimal initialAmount) { this.initialAmount = initialAmount; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCounterMessage() { return counterMessage; }
    public void setCounterMessage(String counterMessage) { this.counterMessage = counterMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
