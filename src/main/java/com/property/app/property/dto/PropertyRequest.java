package com.property.app.property.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class PropertyRequest {

        @NotBlank(message = "Title is required")
        @Size(max = 120, message = "Title cannot exceed 120 characters")
        private String title;

        @NotBlank(message = "Description is required")
        @Size(max = 2000, message = "Description cannot exceed 2000 characters")
        private String description;

        @NotBlank(message = "Property type is required")
        private String propertyType;

        @NotBlank(message = "Address is required")
        @Size(max = 255, message = "Address cannot exceed 255 characters")
        private String address;

        @NotBlank(message = "City is required")
        @Size(max = 100, message = "City cannot exceed 100 characters")
        private String city;

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be greater than zero")
        private BigDecimal price;

        @NotNull(message = "Number of bedrooms is required")
        @PositiveOrZero(message = "Bedrooms cannot be negative")
        private Integer bedrooms;

        @NotNull(message = "Number of bathrooms is required")
        @PositiveOrZero(message = "Bathrooms cannot be negative")
        private Integer bathrooms;

        @NotNull(message = "Area is required")
        @Positive(message = "Area must be greater than zero")
        private Double area;

        @NotBlank(message = "Property status is required")
        private String status;

        @Size(max = 500, message = "Image URL cannot exceed 500 characters")
        private String imageUrl;

        public PropertyRequest() {
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

        public String getPropertyType() {
                return propertyType;
        }

        public void setPropertyType(String propertyType) {
                this.propertyType = propertyType;
        }

        public String getAddress() {
                return address;
        }

        public void setAddress(String address) {
                this.address = address;
        }

        public String getCity() {
                return city;
        }

        public void setCity(String city) {
                this.city = city;
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

        public String getStatus() {
                return status;
        }

        public void setStatus(String status) {
                this.status = status;
        }

        public String getImageUrl() {
                return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
                this.imageUrl = imageUrl;
        }
}