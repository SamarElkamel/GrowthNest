package tn.esprit.growthnestback.dto;

public record CheckoutDTO (
        Long userId,
        String deliveryAddress,
        String paymentMethod,
        int redeemedPoints
){
}
