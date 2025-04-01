package tn.esprit.growthnestback.dto;

public record OrderItemDTO(
        Long productId,
        String productName,
        Double priceAtTime,
        Integer quantity
) {}
