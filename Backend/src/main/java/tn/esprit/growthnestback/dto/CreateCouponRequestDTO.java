package tn.esprit.growthnestback.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.List;

public record CreateCouponRequestDTO(
        @NotBlank(message = "Coupon code is required")
        String code,

        @NotNull(message = "Discount percentage is required")
        @DecimalMin(value = "0.1", inclusive = true, message = "Discount must be at least 0.1%")
        @DecimalMax(value = "100.0", inclusive = true, message = "Discount cannot exceed 100%")
        Double discountPercentage,

        @NotNull(message = "Expiry date is required")
        @Future(message = "Expiry date must be in the future")
        LocalDateTime expiryDate,

        @NotNull(message = "Global flag must be specified")
        Boolean global,

        List<@NotNull(message = "Product ID must not be null") Long> productIds,

        @NotNull(message = "Owner ID is required")
        Long ownerId,

        @NotNull(message = "Max uses is required")
        @Positive(message = "Max uses must be greater than 0")
        Integer maxUses,

        Integer usageCount
) {
}
