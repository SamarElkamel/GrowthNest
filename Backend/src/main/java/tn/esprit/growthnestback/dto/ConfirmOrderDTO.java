package tn.esprit.growthnestback.dto;

public record ConfirmOrderDTO(Long userId, Long cartId, String paymentMethod, String deliveryAddress) {
}
