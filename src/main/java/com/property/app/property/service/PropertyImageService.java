package com.property.app.property.service;

import com.property.app.property.dto.PropertyImageResponse;
import com.property.app.property.exception.InvalidPropertyImageException;
import com.property.app.property.exception.PropertyImageNotFoundException;
import com.property.app.property.exception.PropertyNotFoundException;
import com.property.app.property.model.Property;
import com.property.app.property.model.PropertyImage;
import com.property.app.property.repository.PropertyImageRepository;
import com.property.app.property.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class PropertyImageService {

    private static final long MAX_IMAGE_SIZE =
            5L * 1024L * 1024L;

    private static final long MAX_IMAGES_PER_PROPERTY = 10L;

    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of("image/jpeg", "image/png");

    private final PropertyImageRepository propertyImageRepository;
    private final PropertyRepository propertyRepository;
    private final Path uploadPath;

    public PropertyImageService(
            PropertyImageRepository propertyImageRepository,
            PropertyRepository propertyRepository,
            @Value("${property.image.upload-directory}")
            String uploadDirectory
    ) {
        this.propertyImageRepository = propertyImageRepository;
        this.propertyRepository = propertyRepository;

        this.uploadPath = Path.of(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        createUploadDirectory();
    }

    public PropertyImageResponse uploadImage(
            Long propertyId,
            MultipartFile file
    ) {
        Property property = findProperty(propertyId);

        validateImage(propertyId, file);

        String contentType = file.getContentType();

        String extension = "image/png".equals(contentType)
                ? ".png"
                : ".jpg";

        String storedFileName =
                UUID.randomUUID() + extension;

        Path destination =
                safeDestination(storedFileName);

        storeFile(file, destination);

        try {
            boolean firstImage = propertyImageRepository
                    .countByPropertyId(propertyId) == 0;

            PropertyImage image = new PropertyImage();

            image.setPropertyId(propertyId);
            image.setStoredFileName(storedFileName);

            image.setOriginalFileName(
                    safeOriginalFileName(
                            file.getOriginalFilename()
                    )
            );

            image.setContentType(contentType);
            image.setFileSize(file.getSize());
            image.setPrimaryImage(firstImage);

            PropertyImage savedImage =
                    propertyImageRepository.save(image);

            if (firstImage) {
                property.setImageUrl(
                        buildImageUrl(storedFileName)
                );

                propertyRepository.save(property);
            }

            return convertToResponse(savedImage);

        } catch (RuntimeException exception) {
            deleteFileQuietly(destination);
            throw exception;
        }
    }

    @Transactional(readOnly = true)
    public List<PropertyImageResponse> getImagesForProperty(
            Long propertyId
    ) {
        findProperty(propertyId);

        return propertyImageRepository
                .findAllByPropertyIdOrderByUploadedAtAsc(
                        propertyId
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public PropertyImageResponse setPrimaryImage(
            Long propertyId,
            Long imageId
    ) {
        Property property = findProperty(propertyId);

        PropertyImage selectedImage =
                findImage(propertyId, imageId);

        List<PropertyImage> images = propertyImageRepository
                .findAllByPropertyIdOrderByUploadedAtAsc(
                        propertyId
                );

        for (PropertyImage image : images) {
            image.setPrimaryImage(
                    image.getId().equals(imageId)
            );
        }

        propertyImageRepository.saveAll(images);

        property.setImageUrl(
                buildImageUrl(
                        selectedImage.getStoredFileName()
                )
        );

        propertyRepository.save(property);

        selectedImage.setPrimaryImage(true);

        return convertToResponse(selectedImage);
    }

    public void deleteImage(
            Long propertyId,
            Long imageId
    ) {
        Property property = findProperty(propertyId);

        PropertyImage image =
                findImage(propertyId, imageId);

        boolean deletedPrimaryImage =
                image.isPrimaryImage();

        propertyImageRepository.delete(image);
        propertyImageRepository.flush();

        deleteStoredFile(image.getStoredFileName());

        if (deletedPrimaryImage) {
            PropertyImage nextPrimaryImage =
                    propertyImageRepository
                            .findFirstByPropertyIdOrderByUploadedAtAsc(
                                    propertyId
                            )
                            .orElse(null);

            if (nextPrimaryImage == null) {
                property.setImageUrl(null);
            } else {
                nextPrimaryImage.setPrimaryImage(true);

                propertyImageRepository.save(
                        nextPrimaryImage
                );

                property.setImageUrl(
                        buildImageUrl(
                                nextPrimaryImage
                                        .getStoredFileName()
                        )
                );
            }

            propertyRepository.save(property);
        }
    }

    public void deleteAllImagesForProperty(
            Long propertyId
    ) {
        List<PropertyImage> images = propertyImageRepository
                .findAllByPropertyIdOrderByUploadedAtAsc(
                        propertyId
                );

        for (PropertyImage image : images) {
            deleteStoredFile(
                    image.getStoredFileName()
            );
        }

        propertyImageRepository
                .deleteAllByPropertyId(propertyId);
    }

    private void validateImage(
            Long propertyId,
            MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            throw new InvalidPropertyImageException(
                    "Please select a non-empty image"
            );
        }

        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new InvalidPropertyImageException(
                    "Image size cannot exceed 5 MB"
            );
        }

        if (!ALLOWED_CONTENT_TYPES.contains(
                file.getContentType()
        )) {
            throw new InvalidPropertyImageException(
                    "Only JPEG and PNG images are allowed"
            );
        }

        if (propertyImageRepository
                .countByPropertyId(propertyId)
                >= MAX_IMAGES_PER_PROPERTY) {
            throw new InvalidPropertyImageException(
                    "A property can contain a maximum of 10 images"
            );
        }
    }

    private Property findProperty(Long propertyId) {
        return propertyRepository.findById(propertyId)
                .orElseThrow(() ->
                        new PropertyNotFoundException(
                                propertyId
                        )
                );
    }

    private PropertyImage findImage(
            Long propertyId,
            Long imageId
    ) {
        return propertyImageRepository
                .findByIdAndPropertyId(
                        imageId,
                        propertyId
                )
                .orElseThrow(() ->
                        new PropertyImageNotFoundException(
                                propertyId,
                                imageId
                        )
                );
    }

    private void createUploadDirectory() {
        try {
            Files.createDirectories(uploadPath);

        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Could not create the property image directory",
                    exception
            );
        }
    }

    private Path safeDestination(
            String storedFileName
    ) {
        Path destination = uploadPath
                .resolve(storedFileName)
                .normalize();

        if (!destination.startsWith(uploadPath)) {
            throw new InvalidPropertyImageException(
                    "Invalid image file name"
            );
        }

        return destination;
    }

    private void storeFile(
            MultipartFile file,
            Path destination
    ) {
        try (InputStream inputStream =
                     file.getInputStream()) {

            Files.copy(
                    inputStream,
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );

        } catch (IOException exception) {
            throw new InvalidPropertyImageException(
                    "The image could not be stored"
            );
        }
    }

    private void deleteStoredFile(
            String storedFileName
    ) {
        Path filePath =
                safeDestination(storedFileName);

        try {
            Files.deleteIfExists(filePath);

        } catch (IOException exception) {
            throw new InvalidPropertyImageException(
                    "The stored image could not be deleted"
            );
        }
    }

    private void deleteFileQuietly(Path filePath) {
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {
            // Preserve the original error.
        }
    }

    private String safeOriginalFileName(
            String originalFileName
    ) {
        if (originalFileName == null
                || originalFileName.isBlank()) {
            return "image";
        }

        String fileName = Path.of(originalFileName)
                .getFileName()
                .toString();

        return fileName.length() <= 255
                ? fileName
                : fileName.substring(
                fileName.length() - 255
        );
    }

    private String buildImageUrl(
            String storedFileName
    ) {
        return "/uploads/property-images/"
                + storedFileName;
    }

    private PropertyImageResponse convertToResponse(
            PropertyImage image
    ) {
        PropertyImageResponse response =
                new PropertyImageResponse();

        response.setId(image.getId());
        response.setPropertyId(image.getPropertyId());

        response.setOriginalFileName(
                image.getOriginalFileName()
        );

        response.setContentType(image.getContentType());
        response.setFileSize(image.getFileSize());

        response.setImageUrl(
                buildImageUrl(
                        image.getStoredFileName()
                )
        );

        response.setPrimaryImage(
                image.isPrimaryImage()
        );

        response.setUploadedAt(
                image.getUploadedAt()
        );

        return response;
    }
}