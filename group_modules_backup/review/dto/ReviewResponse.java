package com.property.app.review.dto;

import com.property.app.review.model.Review;
import java.time.LocalDateTime;

public class ReviewResponse {

    private Long id;
    private Long propertyId;
    private Long buyerId;
    private String buyerName;
    private Long agentId;
    private Long paymentId;
    private Integer rating;
    private String comment;
    private String response;
    private Review.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReviewResponse() {}

    public static ReviewResponse fromEntity(Review r) {
        ReviewResponse res = new ReviewResponse();
        res.setId(r.getId());
        res.setPropertyId(r.getPropertyId());
        res.setBuyerId(r.getBuyerId());
        res.setBuyerName(r.getBuyerName());
        res.setAgentId(r.getAgentId());
        res.setPaymentId(r.getPaymentId());
        res.setRating(r.getRating());
        res.setComment(r.getComment());
        res.setResponse(r.getResponse());
        res.setStatus(r.getStatus());
        res.setCreatedAt(r.getCreatedAt());
        res.setUpdatedAt(r.getUpdatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public Review.Status getStatus() { return status; }
    public void setStatus(Review.Status status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
