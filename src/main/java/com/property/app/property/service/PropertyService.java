package com.property.app.property.service;

import com.property.app.property.dto.PropertyRequest;
import com.property.app.property.dto.PropertyResponse;
import com.property.app.property.model.Property;
import com.property.app.property.repository.PropertyRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    // Create a new property listing
    public PropertyResponse createProperty(PropertyRequest request) {

        Property property = new Property();

        copyRequestToProperty(request, property);

        Property savedProperty = propertyRepository.save(property);

        return convertToResponse(savedProperty);
    }

    // Get every property listing
    @Transactional(readOnly = true)
    public List<PropertyResponse> getAllProperties() {

        return propertyRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get one property using its ID
    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(Long id) {

        Property property = findPropertyById(id);

        return convertToResponse(property);
    }

    // Internal method used to find a property
    private Property findPropertyById(Long id) {

        return propertyRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Property not found with ID: " + id
                        )
                );
    }

    // Copy request data into the Property entity
    private void copyRequestToProperty(
            PropertyRequest request,
            Property property
    ) {

        BeanUtils.copyProperties(
                request,
                property,
                "id",
                "status",
                "createdAt",
                "updatedAt"
        );
    }

    // Convert a Property entity into PropertyResponse
    private PropertyResponse convertToResponse(Property property) {

        PropertyResponse response = new PropertyResponse();

        BeanUtils.copyProperties(property, response);

        return response;
    }
}