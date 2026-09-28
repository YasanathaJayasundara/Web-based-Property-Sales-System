package com.property.app.offer.dto;

import com.property.app.offer.model.Offer;
import com.property.app.offer.model.OfferHistory;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OfferResponse {

    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private Long buyerId;
    private String buyerName;
    private Long sellerId;
    private BigDecimal offerAmount;
    private BigDecimal counterAmount;
    private BigDecimal initialAmount;
    private Offer.Status status;
    private String message;
    private String counterMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OfferHistory> history = new ArrayList<>();

    public OfferResponse() {}

    public static OfferResponse fromEntity(Offer o, List<OfferHistory> history) {
        OfferResponse r = new OfferResponse();
        r.setId(o.getId());
        r.setPropertyId(o.getPropertyId());
        r.setPropertyTitle(o.getPropertyTitle());
        r.setBuyerId(o.getBuyerId());
        r.setBuyerName(o.getBuyerName());
        r.setSellerId(o.getSellerId());
        r.setOfferAmount(o.getOfferAmount());
        r.setCounterAmount(o.getCounterAmount());
        r.setInitialAmount(o.getInitialAmount());
        r.setStatus(o.getStatus());
        r.setMessage(o.getMessage());
        r.setCounterMessage(o.getCounterMessage());
        r.setCreatedAt(o.getCreatedAt());
        r.setUpdatedAt(o.getUpdatedAt());
        if (history != null) {
            r.setHistory(history);
        }
        return r;
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

    public Offer.Status getStatus() { return status; }
    public void setStatus(Offer.Status status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCounterMessage() { return counterMessage; }
    public void setCounterMessage(String counterMessage) { this.counterMessage = counterMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<OfferHistory> getHistory() { return history; }
    public void setHistory(List<OfferHistory> history) { this.history = history; }
}
