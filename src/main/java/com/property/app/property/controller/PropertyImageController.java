package com.property.app.property.controller;

import com.property.app.property.dto.PropertyImageResponse;
import com.property.app.property.service.PropertyImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/properties/{propertyId}/images")
public class PropertyImageController {

    private final PropertyImageService propertyImageService;

    public PropertyImageController(
            PropertyImageService propertyImageService
    ) {
        this.propertyImageService = propertyImageService;
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<PropertyImageResponse> uploadImage(
            @PathVariable Long propertyId,
            @RequestPart("file") MultipartFile file
    ) {
        PropertyImageResponse uploadedImage =
                propertyImageService.uploadImage(
                        propertyId,
                        file
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(uploadedImage);
    }

    @GetMapping
    public ResponseEntity<List<PropertyImageResponse>>
    getImages(
            @PathVariable Long propertyId
    ) {
        return ResponseEntity.ok(
                propertyImageService
                        .getImagesForProperty(propertyId)
        );
    }

    @PatchMapping("/{imageId}/primary")
    public ResponseEntity<PropertyImageResponse>
    setPrimaryImage(
            @PathVariable Long propertyId,
            @PathVariable Long imageId
    ) {
        return ResponseEntity.ok(
                propertyImageService.setPrimaryImage(
                        propertyId,
                        imageId
                )
        );
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long propertyId,
            @PathVariable Long imageId
    ) {
        propertyImageService.deleteImage(
                propertyId,
                imageId
        );

        return ResponseEntity.noContent().build();
    }
}