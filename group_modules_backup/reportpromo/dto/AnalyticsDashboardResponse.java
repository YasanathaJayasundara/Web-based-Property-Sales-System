package com.property.app.reportpromo.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class AnalyticsDashboardResponse {

    private BigDecimal totalRevenue;
    private Long totalSales;
    private Long activeListings;
    private Long totalUsers;
    private Long activePromotions;
    private Long pendingAppointments;
    private List<MonthlyTrend> salesTrend = new ArrayList<>();
    private List<TypeCount> propertyTypeBreakdown = new ArrayList<>();
    private List<AgentStat> agentPerformance = new ArrayList<>();
    private List<PromotionResponse> topPromotions = new ArrayList<>();

    public static class MonthlyTrend {
        private String month;
        private int sales;
        private double revenue;

        public MonthlyTrend() {}
        public MonthlyTrend(String month, int sales, double revenue) {
            this.month = month;
            this.sales = sales;
            this.revenue = revenue;
        }
        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public int getSales() { return sales; }
        public void setSales(int sales) { this.sales = sales; }
        public double getRevenue() { return revenue; }
        public void setRevenue(double revenue) { this.revenue = revenue; }
    }

    public static class TypeCount {
        private String type;
        private int count;

        public TypeCount() {}
        public TypeCount(String type, int count) {
            this.type = type;
            this.count = count;
        }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }
    }

    public static class AgentStat {
        private String agent;
        private int closed;
        private int avgDays;

        public AgentStat() {}
        public AgentStat(String agent, int closed, int avgDays) {
            this.agent = agent;
            this.closed = closed;
            this.avgDays = avgDays;
        }
        public String getAgent() { return agent; }
        public void setAgent(String agent) { this.agent = agent; }
        public int getClosed() { return closed; }
        public void setClosed(int closed) { this.closed = closed; }
        public int getAvgDays() { return avgDays; }
        public void setAvgDays(int avgDays) { this.avgDays = avgDays; }
    }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getTotalSales() { return totalSales; }
    public void setTotalSales(Long totalSales) { this.totalSales = totalSales; }

    public Long getActiveListings() { return activeListings; }
    public void setActiveListings(Long activeListings) { this.activeListings = activeListings; }

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getActivePromotions() { return activePromotions; }
    public void setActivePromotions(Long activePromotions) { this.activePromotions = activePromotions; }

    public Long getPendingAppointments() { return pendingAppointments; }
    public void setPendingAppointments(Long pendingAppointments) { this.pendingAppointments = pendingAppointments; }

    public List<MonthlyTrend> getSalesTrend() { return salesTrend; }
    public void setSalesTrend(List<MonthlyTrend> salesTrend) { this.salesTrend = salesTrend; }

    public List<TypeCount> getPropertyTypeBreakdown() { return propertyTypeBreakdown; }
    public void setPropertyTypeBreakdown(List<TypeCount> propertyTypeBreakdown) { this.propertyTypeBreakdown = propertyTypeBreakdown; }

    public List<AgentStat> getAgentPerformance() { return agentPerformance; }
    public void setAgentPerformance(List<AgentStat> agentPerformance) { this.agentPerformance = agentPerformance; }

    public List<PromotionResponse> getTopPromotions() { return topPromotions; }
    public void setTopPromotions(List<PromotionResponse> topPromotions) { this.topPromotions = topPromotions; }
}
