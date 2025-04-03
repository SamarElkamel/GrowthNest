package tn.esprit.growthnestback.Services;

import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Coupons;
import tn.esprit.growthnestback.dto.CreateCouponRequestDTO;


public interface ICouponService {
    Coupons createCoupon(CreateCouponRequestDTO request);
}
