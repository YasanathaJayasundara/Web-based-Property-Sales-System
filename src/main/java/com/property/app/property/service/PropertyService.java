package com.property.app.property.service;

import com.property.app.property.dto.PropertyRequest;
import com.property.app.property.dto.PropertyResponse;
import com.property.app.property.exception.InvalidPropertyStatusException;
import com.property.app.property.exception.InvalidSearchCriteriaException;
import com.property.app.property.exception.PropertyNotFoundException;
import com.property.app.property.model.Property;
import com.property.app.property.repository.PropertyRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@Service
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageService propertyImageService;

    public PropertyService(
            PropertyRepository propertyRepository,
            PropertyImageService propertyImageService
    ) {
        this.propertyRepository = propertyRepository;
        this.propertyImageService = propertyImageService;
    }

    public PropertyResponse createProperty(PropertyRequest request) {
        Property property = new Property();

        copyRequestToProperty(request, property);

        property.setStatus(Property.Status.PENDING);
        property.setRejectionReason(null);

        Property savedProperty =
                propertyRepository.save(property);

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
    public List<PropertyResponse> getPendingProperties() {
        return getPropertiesByStatus(
                Property.Status.PENDING
        );
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getPublishedProperties() {
        return getPropertiesByStatus(
                Property.Status.PUBLISHED
        );
    }

    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(Long id) {
        Property property = findPropertyById(id);

        return convertToResponse(property);
    }

    public PropertyResponse updateProperty(
            Long id,
            PropertyRequest request
    ) {
        Property existingProperty =
                findPropertyById(id);

        copyRequestToProperty(
                request,
                existingProperty
        );

        Property updatedProperty =
                propertyRepository.save(existingProperty);

        return convertToResponse(updatedProperty);
    }

    public void deleteProperty(Long id) {
        Property existingProperty =
                findPropertyById(id);

        propertyImageService
                .deleteAllImagesForProperty(id);

        propertyRepository.delete(existingProperty);
    }

    public PropertyResponse approveProperty(Long id) {
        Property property = findPropertyById(id);

        if (property.getStatus()
                == Property.Status.APPROVED) {
            return convertToResponse(property);
        }

        requireStatus(
                property,
                Property.Status.PENDING,
                "approved"
        );

        property.setStatus(Property.Status.APPROVED);
        property.setRejectionReason(null);

        Property approvedProperty =
                propertyRepository.save(property);

        return convertToResponse(approvedProperty);
    }

    public PropertyResponse publishProperty(Long id) {
        Property property = findPropertyById(id);

        if (property.getStatus()
                == Property.Status.PUBLISHED) {
            return convertToResponse(property);
        }

        requireStatus(
                property,
                Property.Status.APPROVED,
                "published"
        );

        property.setStatus(Property.Status.PUBLISHED);

        Property publishedProperty =
                propertyRepository.save(property);

        return convertToResponse(publishedProperty);
    }

    public PropertyResponse rejectProperty(
            Long id,
            String reason
    ) {
        Property property = findPropertyById(id);

        requireStatus(
                property,
                Property.Status.PENDING,
                "rejected"
        );

        property.setStatus(Property.Status.REJECTED);
        property.setRejectionReason(reason.trim());

        Property rejectedProperty =
                propertyRepository.save(property);

        return convertToResponse(rejectedProperty);
    }

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

        String normalizedKeyword =
                normalizeText(keyword);

        String normalizedCity =
                normalizeText(city);

        String normalizedType =
                normalizeText(propertyType);

        Property.Status normalizedStatus =
                parseStatus(status);

        String keywordPattern =
                normalizedKeyword == null
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

    private Property.Status parseStatus(String status) {
        String normalizedStatus =
                normalizeText(status);

        if (normalizedStatus == null) {
            return null;
        }

        try {
            return Property.Status.valueOf(
                    normalizedStatus.toUpperCase(
                            Locale.ROOT
                    )
            );

        } catch (IllegalArgumentException exception) {
            throw new InvalidSearchCriteriaException(
                    "Unknown property status: " + status
            );
        }
    }

    private List<PropertyResponse> getPropertiesByStatus(
            Property.Status status
    ) {
        return propertyRepository
                .findAllByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private void requireStatus(
            Property property,
            Property.Status requiredStatus,
            String action
    ) {
        if (property.getStatus() != requiredStatus) {
            throw new InvalidPropertyStatusException(
                    property.getId(),
                    property.getStatus(),
                    requiredStatus,
                    action
            );
        }
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
                "imageUrl",
                "status",
                "rejectionReason",
                "createdAt",
                "updatedAt"
        );
    }

    private PropertyResponse convertToResponse(
            Property property
    ) {
        PropertyResponse response =
                new PropertyResponse();

        BeanUtils.copyProperties(
                property,
                response
        );

        response.setImages(
                propertyImageService
                        .getImagesForProperty(
                                property.getId()
                        )
        );

        return response;
    }
}