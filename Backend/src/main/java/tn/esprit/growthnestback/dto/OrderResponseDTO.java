package tn.esprit.growthnestback.dto;

import java.util.List;

public record OrderResponseDTO (Long orderId,
                               Double totalAmount,
                               String status,
                               String deliveryAddress,
                               String paymentMethod,
                               List<OrderItemDTO> items ,
                                String couponCode,
                                Double discountAmount){
}
