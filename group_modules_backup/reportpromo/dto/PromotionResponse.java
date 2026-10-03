package com.property.app.reportpromo.dto;

import com.property.app.reportpromo.model.Promotion;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PromotionResponse {

    private Long id;
    private String title;
    private String description;
    private String promoCode;
    private Promotion.DiscountType discountType;
    private BigDecimal discountValue;
    private String bannerImageUrl;
    private String targetUrl;
    private String targetPropertyType;
    private Promotion.Placement placement;
    private Promotion.Status status;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer clickCount;
    private Integer impressionCount;
    private Double clickThroughRate;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PromotionResponse() {}

    public static PromotionResponse fromEntity(Promotion p) {
        PromotionResponse r = new PromotionResponse();
        r.setId(p.getId());
        r.setTitle(p.getTitle());
        r.setDescription(p.getDescription());
        r.setPromoCode(p.getPromoCode());
        r.setDiscountType(p.getDiscountType());
        r.setDiscountValue(p.getDiscountValue());
        r.setBannerImageUrl(p.getBannerImageUrl());
        r.setTargetUrl(p.getTargetUrl());
        r.setTargetPropertyType(p.getTargetPropertyType());
        r.setPlacement(p.getPlacement());
        r.setStatus(p.getStatus());
        r.setStartDate(p.getStartDate());
        r.setEndDate(p.getEndDate());
        r.setClickCount(p.getClickCount());
        r.setImpressionCount(p.getImpressionCount());
        r.setCreatedBy(p.getCreatedBy());
        r.setCreatedAt(p.getCreatedAt());
        r.setUpdatedAt(p.getUpdatedAt());

        if (p.getImpressionCount() != null && p.getImpressionCount() > 0 && p.getClickCount() != null) {
            double ctr = ((double) p.getClickCount() / p.getImpressionCount()) * 100.0;
            r.setClickThroughRate(Math.round(ctr * 10.0) / 10.0);
        } else {
            r.setClickThroughRate(0.0);
        }
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Integer getClickCount() { return clickCount; }
    public void setClickCount(Integer clickCount) { this.clickCount = clickCount; }

    public Integer getImpressionCount() { return impressionCount; }
    public void setImpressionCount(Integer impressionCount) { this.impressionCount = impressionCount; }

    public Double getClickThroughRate() { return clickThroughRate; }
    public void setClickThroughRate(Double clickThroughRate) { this.clickThroughRate = clickThroughRate; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
