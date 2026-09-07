package com.property.app.property.service;

import com.property.app.property.dto.PropertyRequest;
import com.property.app.property.dto.PropertyResponse;
import com.property.app.property.model.Property;
import com.property.app.property.repository.PropertyRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    // Create a new property
    public PropertyResponse createProperty(PropertyRequest request) {
        Property property = new Property();

        copyRequestToProperty(request, property);

        Property savedProperty = propertyRepository.save(property);

        return convertToResponse(savedProperty);
    }

    // Get all properties
    @Transactional(readOnly = true)
    public List<PropertyResponse> getAllProperties() {
        return propertyRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get one property by ID
    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(Long id) {
        Property property = findPropertyById(id);

        return convertToResponse(property);
    }

    // Update an existing property
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

    // Delete a property
    public void deleteProperty(Long id) {
        Property existingProperty = findPropertyById(id);

        propertyRepository.delete(existingProperty);
    }

    // Find property or throw an error
    private Property findPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found with ID: " + id
                        )
                );
    }

    // Copy request details into the entity
    private void copyRequestToProperty(
            PropertyRequest request,
            Property property
    ) {
        BeanUtils.copyProperties(request, property);
    }

    // Convert entity into response DTO
    private PropertyResponse convertToResponse(Property property) {
        PropertyResponse response = new PropertyResponse();

        BeanUtils.copyProperties(property, response);

        return response;
    }
}