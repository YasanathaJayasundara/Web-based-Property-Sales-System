package com.property.app.reportpromo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    public enum ReportType {
        SALES_SUMMARY,
        PROPERTY_PERFORMANCE,
        AGENT_METRICS,
        REVENUE_ANALYSIS,
        PROMOTION_EFFECTIVENESS,
        PLATFORM_ACTIVITY
    }

    public enum Status {
        DRAFT,
        FINALIZED,
        ARCHIVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "report_type", nullable = false, length = 50)
    private ReportType reportType = ReportType.SALES_SUMMARY;

    @Column(name = "date_range_start")
    private LocalDate dateRangeStart;

    @Column(name = "date_range_end")
    private LocalDate dateRangeEnd;

    @Column(name = "generated_by", nullable = false, length = 100)
    private String generatedBy = "Shavindi T.D.P.";

    @Column(name = "parameters_json", columnDefinition = "NVARCHAR(MAX)")
    private String parametersJson;

    @Column(name = "summary_data_json", columnDefinition = "NVARCHAR(MAX)")
    private String summaryDataJson;

    @Column(name = "total_revenue", nullable = false, precision = 16, scale = 2)
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(name = "total_transactions", nullable = false)
    private Integer totalTransactions = 0;

    @Column(length = 2000)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.FINALIZED;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Report() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = Status.FINALIZED;
        if (this.totalRevenue == null) this.totalRevenue = BigDecimal.ZERO;
        if (this.totalTransactions == null) this.totalTransactions = 0;
        if (this.generatedBy == null) this.generatedBy = "Shavindi T.D.P.";
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public ReportType getReportType() { return reportType; }
    public void setReportType(ReportType reportType) { this.reportType = reportType; }

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

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
