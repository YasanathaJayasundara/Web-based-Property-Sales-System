package com.property.app.offer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class OfferRequest {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotBlank(message = "Property title is required")
    private String propertyTitle;

    @NotNull(message = "Buyer ID is required")
    private Long buyerId;

    @NotBlank(message = "Buyer name is required")
    private String buyerName;

    @NotNull(message = "Seller ID is required")
    private Long sellerId;

    @NotNull(message = "Offer amount is required")
    @Positive(message = "Offer amount must be positive")
    private BigDecimal offerAmount;

    private String message;

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

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
