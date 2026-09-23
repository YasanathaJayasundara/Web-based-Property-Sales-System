package com.property.app.property.exception;

public class PropertyNotFoundException extends RuntimeException {

    public PropertyNotFoundException(Long propertyId) {
        super("Property not found with ID: " + propertyId);
    }
}