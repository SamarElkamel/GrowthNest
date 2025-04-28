package tn.esprit.growthnestback.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Services.RevenueService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {
    @Autowired
    private RevenueService revenueService;

    @GetMapping("/total/{businessId}")
    public BigDecimal getTotalRevenue(
            @PathVariable Long businessId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return revenueService.getTotalRevenue(businessId, start, end);
    }

    @GetMapping("/profit/{businessId}")
    public BigDecimal getGrossProfit(
            @PathVariable Long businessId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return revenueService.getGrossProfit(businessId, start, end);
    }

    @GetMapping("/sales-by-product/{businessId}")
    public List<Map<String, Object>> getSalesByProduct(
            @PathVariable Long businessId,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "5") int limit) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return revenueService.getSalesByProduct(businessId, start, end, limit);
    }

    @GetMapping("/trends/{businessId}")
    public List<Map<String, Object>> getRevenueTrends(
            @PathVariable Long businessId,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam String granularity) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);
        return revenueService.getRevenueTrends(businessId, start, end, granularity);
    }

}
