package tn.esprit.growthnestback.dto;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
public record CreateOrderRequestDTO(
        Long userId,
       // @NotBlank(message = "Delivery address is required")
        String deliveryAddress,

        //@NotBlank(message = "Payment method is required")
        String paymentMethod,

       // @NotNull(message = "Order details list is required")
       // @Size(min = 1, message = "At least one order item must be provided")
       // List<@Valid OrderDetailDTO> orderDetails
        List<OrderDetailDTO> orderDetails
) {
}
