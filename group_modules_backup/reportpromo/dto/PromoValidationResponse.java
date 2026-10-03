package com.property.app.reportpromo.dto;

import com.property.app.reportpromo.model.Promotion;
import java.math.BigDecimal;

public class PromoValidationResponse {

    private boolean valid;
    private String promoCode;
    private String title;
    private Promotion.DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal calculatedDiscount;
    private BigDecimal finalPrice;
    private String message;

    public PromoValidationResponse() {}

    public static PromoValidationResponse invalid(String message) {
        PromoValidationResponse r = new PromoValidationResponse();
        r.setValid(false);
        r.setMessage(message);
        return r;
    }

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Promotion.DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(Promotion.DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getCalculatedDiscount() { return calculatedDiscount; }
    public void setCalculatedDiscount(BigDecimal calculatedDiscount) { this.calculatedDiscount = calculatedDiscount; }

    public BigDecimal getFinalPrice() { return finalPrice; }
    public void setFinalPrice(BigDecimal finalPrice) { this.finalPrice = finalPrice; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
