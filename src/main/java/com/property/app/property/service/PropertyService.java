package com.property.app.property.service;

import com.property.app.property.dto.PropertyRequest;
import com.property.app.property.dto.PropertyResponse;
import com.property.app.property.exception.InvalidSearchCriteriaException;
import com.property.app.property.exception.PropertyNotFoundException;
import com.property.app.property.model.Property;
import com.property.app.property.repository.PropertyRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public PropertyResponse createProperty(PropertyRequest request) {
        Property property = new Property();

        copyRequestToProperty(request, property);

        Property savedProperty = propertyRepository.save(property);

        return convertToResponse(savedProperty);
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getAllProperties() {
        return propertyRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(Long id) {
        return convertToResponse(findPropertyById(id));
    }

    public PropertyResponse updateProperty(
            Long id,
            PropertyRequest request
    ) {
        Property existingProperty = findPropertyById(id);

        copyRequestToProperty(request, existingProperty);

        Property updatedProperty =
                propertyRepository.save(existingProperty);

        return convertToResponse(updatedProperty);
    }

    public void deleteProperty(Long id) {
        Property existingProperty = findPropertyById(id);

        propertyRepository.delete(existingProperty);
    }

    // Search and filter properties
    @Transactional(readOnly = true)
    public List<PropertyResponse> searchProperties(
            String keyword,
            String city,
            String propertyType,
            String status,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        validatePriceRange(minPrice, maxPrice);

        String normalizedKeyword = normalizeText(keyword);
        String normalizedCity = normalizeText(city);
        String normalizedType = normalizeText(propertyType);
        String normalizedStatus = normalizeText(status);

        String keywordPattern = normalizedKeyword == null
                ? null
                : "%" + normalizedKeyword + "%";

        return propertyRepository.searchProperties(
                        keywordPattern,
                        normalizedCity,
                        normalizedType,
                        normalizedStatus,
                        minPrice,
                        maxPrice
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private void validatePriceRange(
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        if (minPrice != null
                && minPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidSearchCriteriaException(
                    "Minimum price cannot be negative"
            );
        }

        if (maxPrice != null
                && maxPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidSearchCriteriaException(
                    "Maximum price cannot be negative"
            );
        }

        if (minPrice != null
                && maxPrice != null
                && minPrice.compareTo(maxPrice) > 0) {
            throw new InvalidSearchCriteriaException(
                    "Minimum price cannot be greater than maximum price"
            );
        }
    }

    private String normalizeText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private Property findPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() ->
                        new PropertyNotFoundException(id)
                );
    }

    private void copyRequestToProperty(
            PropertyRequest request,
            Property property
    ) {
        BeanUtils.copyProperties(
                request,
                property,
                "id",
                "createdAt",
                "updatedAt"
        );
    }

    private PropertyResponse convertToResponse(Property property) {
        PropertyResponse response = new PropertyResponse();

        BeanUtils.copyProperties(property, response);

        return response;
    }
}