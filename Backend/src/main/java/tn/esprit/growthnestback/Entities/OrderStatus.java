package tn.esprit.growthnestback.Entities;

public enum OrderStatus {
    CART,             // Items added but not yet ordered
    PENDING,          // Order placed but not yet processed
    CONFIRMED,        // Confirmed by the seller or system
    SHIPPED,          // Shipped to user
    DELIVERED,        // Successfully delivered
    CANCELLED,        // Cancelled by user or system
    RETURNED
}
