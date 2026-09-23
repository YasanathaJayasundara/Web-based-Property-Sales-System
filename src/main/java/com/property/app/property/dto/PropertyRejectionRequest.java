package com.property.app.property.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PropertyRejectionRequest {

    @NotBlank(message = "Rejection reason is required")
    @Size(
            max = 500,
            message = "Rejection reason cannot exceed 500 characters"
    )
    private String reason;

    public PropertyRejectionRequest() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}