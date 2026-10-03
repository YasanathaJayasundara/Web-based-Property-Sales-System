package com.property.app.reportpromo.controller;

import com.property.app.reportpromo.dto.AnalyticsDashboardResponse;
import com.property.app.reportpromo.dto.ReportGenerateRequest;
import com.property.app.reportpromo.dto.ReportResponse;
import com.property.app.reportpromo.model.Report;
import com.property.app.reportpromo.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ReportResponse> generateReport(@Valid @RequestBody ReportGenerateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.generateReport(request));
    }

    @GetMapping
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportResponse> updateReport(
            @PathVariable Long id,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) Report.Status status
    ) {
        return ResponseEntity.ok(reportService.updateReport(id, notes, status));
    }

    @GetMapping("/analytics/dashboard")
    public ResponseEntity<AnalyticsDashboardResponse> getDashboardAnalytics(
            @RequestParam(defaultValue = "6m") String range
    ) {
        return ResponseEntity.ok(reportService.getLiveDashboardAnalytics(range));
    }

    @GetMapping(value = "/{id}/export", produces = "text/csv")
    public ResponseEntity<String> exportReport(@PathVariable Long id) {
        String csv = reportService.exportReportToCsv(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"report-" + id + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}
