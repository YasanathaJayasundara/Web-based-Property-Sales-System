package com.property.app.property.dto;

import com.property.app.property.model.Property;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PropertyResponse {

    private Long id;
    private String title;
    private String description;
    private String location;
    private String city;
    private String propertyType;
    private BigDecimal price;
    private Integer bedrooms;
    private Integer bathrooms;
    private Double area;
    private String imageUrl;
    private Long sellerId;
    private Property.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PropertyResponse() {
    }

    public PropertyResponse(
            Long id,
            String title,
            String description,
            String location,
            String city,
            String propertyType,
            BigDecimal price,
            Integer bedrooms,
            Integer bathrooms,
            Double area,
            String imageUrl,
            Long sellerId,
            Property.Status status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.city = city;
        this.propertyType = propertyType;
        this.price = price;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.area = area;
        this.imageUrl = imageUrl;
        this.sellerId = sellerId;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public Property.Status getStatus() {
        return status;
    }

    public void setStatus(Property.Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}