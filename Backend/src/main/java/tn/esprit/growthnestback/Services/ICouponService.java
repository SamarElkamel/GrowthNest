package tn.esprit.growthnestback.Services;

import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Coupons;
import tn.esprit.growthnestback.dto.CouponAnalyticsDTO;
import tn.esprit.growthnestback.dto.CouponsResponseDTO;
import tn.esprit.growthnestback.dto.CreateCouponRequestDTO;

import java.util.List;


public interface ICouponService {
    Coupons createCoupon(CreateCouponRequestDTO request);
    List<CouponsResponseDTO> getAllCoupons();
    void toggleCoupon(Long id);
    void deleteCoupon(Long id);
    List<Coupons> findAll();
    public List<CouponAnalyticsDTO> getAnalytics();
}
