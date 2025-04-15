package tn.esprit.growthnestback.Services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Coupons;
import tn.esprit.growthnestback.Entities.Product;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Repository.CouponRepository;
import tn.esprit.growthnestback.Repository.ProductRepository;
import tn.esprit.growthnestback.Repository.UserRepository;
import tn.esprit.growthnestback.dto.CouponAnalyticsDTO;
import tn.esprit.growthnestback.dto.CouponsResponseDTO;
import tn.esprit.growthnestback.dto.CreateCouponRequestDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor

public class CouponServiceImpl implements ICouponService{
    @Autowired
    private CouponRepository couponRepository;
    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private  ProductRepository productRepository;
    @Override
    public Coupons createCoupon(CreateCouponRequestDTO request) {
        if (couponRepository.findByCodeIgnoreCase(request.code()).isPresent()) {
            throw new IllegalArgumentException("Coupon code already exists.");
        }

        User owner = userRepository.findById(request.ownerId())
                .orElseThrow(() -> new EntityNotFoundException("Owner not found"));
        Coupons coupon = new Coupons();

        coupon.setCode(request.code());
        coupon.setDiscountPercentage(request.discountPercentage());
        coupon.setExpiryDate(request.expiryDate());
        coupon.setActive(true);
        coupon.setGlobal(request.global());
        coupon.setMaxUses(request.maxUses());
        coupon.setUsageCount(coupon.getUsageCount());
        coupon.setOwner(owner);
        if (coupon.getUsageCount() >= coupon.getMaxUses()) {
            throw new RuntimeException("Coupon usage limit reached.");
        }
        if (!request.global() && request.productIds() != null) {
            List<Product> products = productRepository.findAllById(request.productIds());
            coupon.setApplicableProducts(products);
        }

        return couponRepository.save(coupon);
    }



    @Scheduled(cron = "0 0 * * * *") // Runs every hour
    public void deactivateExpiredCoupons() {
        List<Coupons> expiredCoupons = couponRepository.findAllByActiveTrueAndExpiryDateBefore(LocalDateTime.now());

        for (Coupons coupon : expiredCoupons) {
            coupon.setActive(false);
        }

        if (!expiredCoupons.isEmpty()) {
            couponRepository.saveAll(expiredCoupons);
            System.out.println("🟡 Deactivated " + expiredCoupons.size() + " expired coupons.");
        } else {
            System.out.println("✅ No expired coupons to deactivate at this time.");
        }
    }
    @Override
    public List<CouponsResponseDTO> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void toggleCoupon(Long id) {
        Coupons coupon = couponRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Coupon not found"));
        coupon.setActive(!coupon.isActive());
        couponRepository.save(coupon);
    }

    @Override
    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }

    private CouponsResponseDTO mapToResponse(Coupons coupon) {
        return new CouponsResponseDTO(
                coupon.getId(),
                coupon.getCode(),
                coupon.getDiscountPercentage(),
                coupon.getExpiryDate(),
                coupon.isActive(),
                coupon.isGlobal(),
                coupon.getOwner().getName(),
                coupon.getMaxUses(),
                coupon.getUsageCount(),
                coupon.getApplicableProducts().stream()
                        .map(Product::getName)
                        .toList()
        );
    }
    @Override
    public List<Coupons> findAll() {
        return couponRepository.findAll();
    }
    public CouponAnalyticsDTO mapToAnalyticsDTO(Coupons coupon) {
        return new CouponAnalyticsDTO(
                coupon.getCode(),
                coupon.getUsageCount(),
                coupon.getMaxUses(),
                coupon.getMaxUses() - coupon.getUsageCount(),
                coupon.getExpiryDate().isBefore(LocalDateTime.now())
        );
    }
    @Override
    public List<CouponAnalyticsDTO> getAnalytics() {
        return couponRepository.findAll().stream()
                .map(this::mapToAnalyticsDTO)
                .toList();
    }
}
