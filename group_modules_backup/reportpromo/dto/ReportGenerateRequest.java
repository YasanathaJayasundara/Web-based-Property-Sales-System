package com.property.app.reportpromo.dto;

import com.property.app.reportpromo.model.Report;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ReportGenerateRequest {

    @NotBlank(message = "Report title is required")
    private String title;

    @NotNull(message = "Report type is required")
    private Report.ReportType reportType;

    private LocalDate dateRangeStart;

    private LocalDate dateRangeEnd;

    private String generatedBy = "Shavindi T.D.P.";

    private String notes;

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

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
