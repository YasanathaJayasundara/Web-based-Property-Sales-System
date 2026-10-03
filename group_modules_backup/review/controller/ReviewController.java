package com.property.app.review.controller;

import com.property.app.review.dto.ReviewReplyRequest;
import com.property.app.review.dto.ReviewRequest;
import com.property.app.review.dto.ReviewResponse;
import com.property.app.review.model.Review;
import com.property.app.review.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(request));
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<ReviewResponse>> getByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(reviewService.getReviewsByProperty(propertyId));
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<ReviewResponse>> getByAgent(@PathVariable Long agentId) {
        return ResponseEntity.ok(reviewService.getReviewsByAgent(agentId));
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<ReviewResponse>> getByBuyer(@PathVariable Long buyerId) {
        return ResponseEntity.ok(reviewService.getReviewsByBuyer(buyerId));
    }

    @PatchMapping("/{id}/respond")
    public ResponseEntity<ReviewResponse> respondToReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewReplyRequest request
    ) {
        return ResponseEntity.ok(reviewService.respondToReview(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ReviewResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam Review.Status status
    ) {
        return ResponseEntity.ok(reviewService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
