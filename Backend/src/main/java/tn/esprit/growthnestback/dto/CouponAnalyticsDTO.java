package tn.esprit.growthnestback.dto;

public record CouponAnalyticsDTO(  String code,
                                   int countUsers,
                                   int maxUses,
                                   int remainingUses,
                                   boolean expired) {
}
