package tn.esprit.growthnestback.dto;


import java.util.List;
public record CreateOrderRequestDTO(
        Long userId,
        String deliveryAddress,
        String paymentMethod,
        List<OrderDetailDTO> orderDetails
) {
}
