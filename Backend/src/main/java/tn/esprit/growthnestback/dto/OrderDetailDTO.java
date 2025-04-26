package tn.esprit.growthnestback.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrderDetailDTO (

       // @NotNull(message = "Product ID is required")
        Long productId,

       // @NotNull(message = "Quantity is required")
       // @Positive(message = "Quantity must be greater than 0")
        Integer quantity
){
}
