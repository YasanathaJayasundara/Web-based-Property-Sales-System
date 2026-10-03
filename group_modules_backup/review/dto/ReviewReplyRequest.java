package com.property.app.review.dto;

import jakarta.validation.constraints.NotBlank;

public class ReviewReplyRequest {

    @NotBlank(message = "Response text is required")
    private String response;

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
}
