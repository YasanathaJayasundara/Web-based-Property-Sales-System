package com.property.app.property.dto;

import java.math.BigDecimal;

public record PropertyResponse(
        Long id,
        String title,
        String city,
        BigDecimal price
) {
}