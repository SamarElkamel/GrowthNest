package tn.esprit.growthnestback.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CouponsResponseDTO(Long id,
                                 String code,
                                 Double discountPercentage,
                                 LocalDateTime expiryDate,
                                 boolean active,
                                 boolean global,
                                 String ownerName,
                                 Integer maxUses,
                                 Integer usageCount,
                                 List<String> productNames) {
}
