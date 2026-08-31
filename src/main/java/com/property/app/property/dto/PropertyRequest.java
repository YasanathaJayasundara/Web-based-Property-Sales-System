package com.property.app.property.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PropertyRequest(

        @NotBlank
        String title,

        @NotBlank
        String city,

        @NotNull
        @DecimalMin("0.0")
        BigDecimal price

) {
}