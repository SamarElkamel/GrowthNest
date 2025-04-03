package tn.esprit.growthnestback.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.growthnestback.Entities.Coupons;
import tn.esprit.growthnestback.Services.CouponServiceImpl;
import tn.esprit.growthnestback.dto.CreateCouponRequestDTO;


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
    }

