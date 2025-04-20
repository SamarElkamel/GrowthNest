package tn.esprit.growthnestback.dto;

import java.math.BigDecimal;

public record RedeemPointsRequest(Long userId, int pointsToRedeem, BigDecimal cartTotal) {
}
