package com.property.app.property.exception;

import com.property.app.property.model.Property;

public class InvalidPropertyStatusException extends RuntimeException {

    public InvalidPropertyStatusException(
            Long propertyId,
            Property.Status currentStatus,
            Property.Status requiredStatus,
            String action
    ) {
        super(
                "Property " + propertyId
                        + " cannot be " + action
                        + " while its status is " + currentStatus
                        + ". Required status: " + requiredStatus
        );
    }
}