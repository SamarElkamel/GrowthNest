package tn.esprit.growthnestback.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Coupons;
import tn.esprit.growthnestback.Repository.CouponRepository;
import tn.esprit.growthnestback.Services.CouponServiceImpl;
import tn.esprit.growthnestback.dto.CouponAnalyticsDTO;
import tn.esprit.growthnestback.dto.CouponsResponseDTO;
import tn.esprit.growthnestback.dto.CreateCouponRequestDTO;

import java.util.List;


@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor

public class CouponRestController {

        @Autowired
        private CouponServiceImpl couponService;

        @PostMapping
        public ResponseEntity<Coupons> createCoupon(@RequestBody CreateCouponRequestDTO request) {
            return ResponseEntity.ok(couponService.createCoupon(request));
        }

    @GetMapping
    public ResponseEntity<List<CouponsResponseDTO>> getAll() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggle(@PathVariable Long id) {
        couponService.toggleCoupon(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/coupons/analytics")
    public List<CouponAnalyticsDTO> getCouponAnalytics() {
        return couponService.getAnalytics();
    }

}

