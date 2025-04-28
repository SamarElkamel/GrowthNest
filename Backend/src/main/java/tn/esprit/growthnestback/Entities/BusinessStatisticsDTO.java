package tn.esprit.growthnestback.Entities;

import lombok.Data;

@Data
public class BusinessStatisticsDTO {
    private long totalBusinesses;
    private long pendingCount;
    private long approvedCount;
    private long rejectedCount;
    private double averageRating;
    private long highRatingCount;

    public long getTotalBusinesses() {
        return totalBusinesses;
    }

    public void setTotalBusinesses(long totalBusinesses) {
        this.totalBusinesses = totalBusinesses;
    }

    public long getPendingCount() {
        return pendingCount;
    }

    public void setPendingCount(long pendingCount) {
        this.pendingCount = pendingCount;
    }

    public long getApprovedCount() {
        return approvedCount;
    }

    public void setApprovedCount(long approvedCount) {
        this.approvedCount = approvedCount;
    }

    public long getRejectedCount() {
        return rejectedCount;
    }

    public void setRejectedCount(long rejectedCount) {
        this.rejectedCount = rejectedCount;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public long getHighRatingCount() {
        return highRatingCount;
    }

    public void setHighRatingCount(long highRatingCount) {
        this.highRatingCount = highRatingCount;
    }
}
