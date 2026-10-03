package com.property.app.reportpromo.dto;

import com.property.app.reportpromo.model.Report;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReportResponse {

    private Long id;
    private String title;
    private Report.ReportType reportType;
    private LocalDate dateRangeStart;
    private LocalDate dateRangeEnd;
    private String generatedBy;
    private String parametersJson;
    private String summaryDataJson;
    private BigDecimal totalRevenue;
    private Integer totalTransactions;
    private String notes;
    private Report.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReportResponse() {}

    public static ReportResponse fromEntity(Report r) {
        ReportResponse res = new ReportResponse();
        res.setId(r.getId());
        res.setTitle(r.getTitle());
        res.setReportType(r.getReportType());
        res.setDateRangeStart(r.getDateRangeStart());
        res.setDateRangeEnd(r.getDateRangeEnd());
        res.setGeneratedBy(r.getGeneratedBy());
        res.setParametersJson(r.getParametersJson());
        res.setSummaryDataJson(r.getSummaryDataJson());
        res.setTotalRevenue(r.getTotalRevenue());
        res.setTotalTransactions(r.getTotalTransactions());
        res.setNotes(r.getNotes());
        res.setStatus(r.getStatus());
        res.setCreatedAt(r.getCreatedAt());
        res.setUpdatedAt(r.getUpdatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Report.ReportType getReportType() { return reportType; }
    public void setReportType(Report.ReportType reportType) { this.reportType = reportType; }

    public LocalDate getDateRangeStart() { return dateRangeStart; }
    public void setDateRangeStart(LocalDate dateRangeStart) { this.dateRangeStart = dateRangeStart; }

    public LocalDate getDateRangeEnd() { return dateRangeEnd; }
    public void setDateRangeEnd(LocalDate dateRangeEnd) { this.dateRangeEnd = dateRangeEnd; }

    public String getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(String generatedBy) { this.generatedBy = generatedBy; }

    public String getParametersJson() { return parametersJson; }
    public void setParametersJson(String parametersJson) { this.parametersJson = parametersJson; }

    public String getSummaryDataJson() { return summaryDataJson; }
    public void setSummaryDataJson(String summaryDataJson) { this.summaryDataJson = summaryDataJson; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public Integer getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(Integer totalTransactions) { this.totalTransactions = totalTransactions; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Report.Status getStatus() { return status; }
    public void setStatus(Report.Status status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
