package com.property.app.reportpromo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
public class Promotion {

    public enum DiscountType {
        PERCENTAGE,
        FIXED_AMOUNT
    }

    public enum Placement {
        HERO_BANNER,
        SIDEBAR,
        FEATURED_LISTING,
        POPUP
    }

    public enum Status {
        ACTIVE,
        INACTIVE,
        EXPIRED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "promo_code", nullable = false, unique = true, length = 50)
    private String promoCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false, length = 30)
    private DiscountType discountType = DiscountType.PERCENTAGE;

    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "banner_image_url", nullable = false, length = 500)
    private String bannerImageUrl;

    @Column(name = "target_url", length = 255)
    private String targetUrl;

    @Column(name = "target_property_type", length = 50)
    private String targetPropertyType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Placement placement = Placement.HERO_BANNER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.ACTIVE;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "click_count", nullable = false)
    private Integer clickCount = 0;

    @Column(name = "impression_count", nullable = false)
    private Integer impressionCount = 0;

    @Column(name = "created_by", length = 100)
    private String createdBy = "Shavindi T.D.P.";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Promotion() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.clickCount == null) this.clickCount = 0;
        if (this.impressionCount == null) this.impressionCount = 0;
        if (this.status == null) this.status = Status.ACTIVE;
        if (this.placement == null) this.placement = Placement.HERO_BANNER;
        if (this.discountType == null) this.discountType = DiscountType.PERCENTAGE;
        if (this.createdBy == null) this.createdBy = "Shavindi T.D.P.";
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public String getBannerImageUrl() { return bannerImageUrl; }
    public void setBannerImageUrl(String bannerImageUrl) { this.bannerImageUrl = bannerImageUrl; }

    public String getTargetUrl() { return targetUrl; }
    public void setTargetUrl(String targetUrl) { this.targetUrl = targetUrl; }

    public String getTargetPropertyType() { return targetPropertyType; }
    public void setTargetPropertyType(String targetPropertyType) { this.targetPropertyType = targetPropertyType; }

    public Placement getPlacement() { return placement; }
    public void setPlacement(Placement placement) { this.placement = placement; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Integer getClickCount() { return clickCount; }
    public void setClickCount(Integer clickCount) { this.clickCount = clickCount; }

    public Integer getImpressionCount() { return impressionCount; }
    public void setImpressionCount(Integer impressionCount) { this.impressionCount = impressionCount; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
