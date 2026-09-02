package com.property.app.property.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class PropertyRequest {

        @NotBlank(message = "Property title is required")
        @Size(
                max = 120,
                message = "Property title cannot exceed 120 characters"
        )
        private String title;

        @NotBlank(message = "Property description is required")
        @Size(
                max = 1000,
                message = "Description cannot exceed 1000 characters"
        )
        private String description;

        @NotBlank(message = "Property location is required")
        private String location;

        @NotBlank(message = "City is required")
        private String city;

        @NotBlank(message = "Property type is required")
        private String propertyType;

        @NotNull(message = "Property price is required")
        @DecimalMin(
                value = "0.01",
                message = "Property price must be greater than zero"
        )
        private BigDecimal price;

        @Min(
                value = 0,
                message = "Number of bedrooms cannot be negative"
        )
        private Integer bedrooms;

        @Min(
                value = 0,
                message = "Number of bathrooms cannot be negative"
        )
        private Integer bathrooms;

        @Positive(message = "Property area must be greater than zero")
        private Double area;

        @Size(
                max = 500,
                message = "Image URL cannot exceed 500 characters"
        )
        private String imageUrl;

        @NotNull(message = "Seller ID is required")
        @Positive(message = "Seller ID must be greater than zero")
        private Long sellerId;

        public PropertyRequest() {
        }

        public PropertyRequest(
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
                Long sellerId
        ) {
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
}