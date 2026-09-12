package com.property.app.property.exception;

public class PropertyImageNotFoundException
        extends RuntimeException {

    public PropertyImageNotFoundException(
            Long propertyId,
            Long imageId
    ) {
        super(
                "Image " + imageId
                        + " was not found for property "
                        + propertyId
        );
    }
}