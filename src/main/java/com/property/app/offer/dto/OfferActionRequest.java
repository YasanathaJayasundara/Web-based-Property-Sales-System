package com.property.app.offer.dto;

import com.property.app.offer.model.Offer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class OfferActionRequest {

    @NotNull(message = "Action status is required")
    private Offer.Status status; // ACCEPTED, REJECTED, COUNTERED, WITHDRAWN

    @NotBlank(message = "Actor role is required")
    private String actorRole; // BUYER, SELLER

    private BigDecimal counterAmount;

    private String message;

    public Offer.Status getStatus() { return status; }
    public void setStatus(Offer.Status status) { this.status = status; }

    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }

    public BigDecimal getCounterAmount() { return counterAmount; }
    public void setCounterAmount(BigDecimal counterAmount) { this.counterAmount = counterAmount; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
