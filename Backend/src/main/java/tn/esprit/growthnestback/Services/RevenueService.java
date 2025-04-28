package tn.esprit.growthnestback.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Order;
import tn.esprit.growthnestback.Entities.OrderDetails;
import tn.esprit.growthnestback.Entities.OrderStatus;
import tn.esprit.growthnestback.Repository.OrderRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RevenueService {

    @Autowired
    private OrderRepository orderRepository;

    // Total revenue for a business over a period
    public BigDecimal getTotalRevenue(Long businessId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findByBusinessIdAndStatusAndDateRange(
                businessId, OrderStatus.CONFIRMED, startDate, endDate);
        return orders.stream()
                .flatMap(order -> order.getOrderDetails().stream())
                .map(detail -> BigDecimal.valueOf(detail.getPriceAtTime())
                        .multiply(BigDecimal.valueOf(detail.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Gross profit (revenue - cost)
    public BigDecimal getGrossProfit(Long businessId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findByBusinessIdAndStatusAndDateRange(
                businessId, OrderStatus.CONFIRMED, startDate, endDate);
        BigDecimal revenue = BigDecimal.ZERO;
        BigDecimal cost = BigDecimal.ZERO;
        for (Order order : orders) {
            for (OrderDetails detail : order.getOrderDetails()) {
                BigDecimal saleValue = BigDecimal.valueOf(detail.getPriceAtTime())
                        .multiply(BigDecimal.valueOf(detail.getQuantity()));
                BigDecimal costValue = detail.getProduct().getCostPrice()
                        .multiply(BigDecimal.valueOf(detail.getQuantity()));
                revenue = revenue.add(saleValue);
                cost = cost.add(costValue);
            }
        }
        return revenue.subtract(cost);
    }

    // Sales by product (returns top N products by revenue)
    public List<Map<String, Object>> getSalesByProduct(Long businessId, LocalDateTime startDate, LocalDateTime endDate, int limit) {
        List<Order> orders = orderRepository.findByBusinessIdAndStatusAndDateRange(
                businessId, OrderStatus.CONFIRMED, startDate, endDate);
        Map<Long, Map<String, Object>> productSales = new HashMap<>();
        for (Order order : orders) {
            for (OrderDetails detail : order.getOrderDetails()) {
                Long productId = detail.getProduct().getIdProduct();
                productSales.computeIfAbsent(productId, k -> new HashMap<>());
                productSales.get(productId).putIfAbsent("name", detail.getProduct().getName());
                BigDecimal revenue = (BigDecimal) productSales.get(productId).getOrDefault("revenue", BigDecimal.ZERO);
                BigDecimal saleValue = BigDecimal.valueOf(detail.getPriceAtTime())
                        .multiply(BigDecimal.valueOf(detail.getQuantity()));
                productSales.get(productId).put("revenue", revenue.add(saleValue));
                int quantity = (int) productSales.get(productId).getOrDefault("quantity", 0) + detail.getQuantity();
                productSales.get(productId).put("quantity", quantity);
            }
        }
        return productSales.values().stream()
                .sorted((a, b) -> ((BigDecimal) b.get("revenue")).compareTo((BigDecimal) a.get("revenue")))
                .limit(limit)
                .collect(Collectors.toList());
    }

    // Revenue trends (daily, weekly, monthly)
    public List<Map<String, Object>> getRevenueTrends(Long businessId, LocalDateTime startDate, LocalDateTime endDate, String granularity) {
        List<Order> orders = orderRepository.findByBusinessIdAndStatusAndDateRange(
                businessId, OrderStatus.CONFIRMED, startDate, endDate);
        Map<String, BigDecimal> trends = new TreeMap<>();
        for (Order order : orders) {
            String key = formatDate(order.getOrderDate(), granularity);
            BigDecimal revenue = order.getOrderDetails().stream()
                    .map(detail -> BigDecimal.valueOf(detail.getPriceAtTime())
                            .multiply(BigDecimal.valueOf(detail.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            trends.merge(key, revenue, BigDecimal::add);
        }
        return trends.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("date", entry.getKey());
                    result.put("revenue", entry.getValue());
                    return result;
                })
                .collect(Collectors.toList());
    }

    private String formatDate(LocalDateTime date, String granularity) {
        switch (granularity) {
            case "daily":
                return date.toLocalDate().toString();
            case "weekly":
                return date.toLocalDate().with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).toString();
            case "monthly":
                return date.toLocalDate().withDayOfMonth(1).toString();
            default:
                throw new IllegalArgumentException("Invalid granularity");
        }
    }
}