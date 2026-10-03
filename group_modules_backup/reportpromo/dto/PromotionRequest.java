package com.property.app.reportpromo.dto;

import com.property.app.reportpromo.model.Promotion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public class PromotionRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Promo code is required")
    private String promoCode;

    private Promotion.DiscountType discountType = Promotion.DiscountType.PERCENTAGE;

    @NotNull(message = "Discount value is required")
    @Positive(message = "Discount value must be greater than zero")
    private BigDecimal discountValue;

    @NotBlank(message = "Banner image URL is required")
    private String bannerImageUrl;

    private String targetUrl;

    private String targetPropertyType;

    private Promotion.Placement placement = Promotion.Placement.HERO_BANNER;

    private Promotion.Status status = Promotion.Status.ACTIVE;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private String createdBy;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

    public Promotion.DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(Promotion.DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public String getBannerImageUrl() { return bannerImageUrl; }
    public void setBannerImageUrl(String bannerImageUrl) { this.bannerImageUrl = bannerImageUrl; }

    public String getTargetUrl() { return targetUrl; }
    public void setTargetUrl(String targetUrl) { this.targetUrl = targetUrl; }

    public String getTargetPropertyType() { return targetPropertyType; }
    public void setTargetPropertyType(String targetPropertyType) { this.targetPropertyType = targetPropertyType; }

    public Promotion.Placement getPlacement() { return placement; }
    public void setPlacement(Promotion.Placement placement) { this.placement = placement; }

    public Promotion.Status getStatus() { return status; }
    public void setStatus(Promotion.Status status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
