package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.Coupons;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupons, Long> {
    Optional<Coupons> findByCodeIgnoreCase (String code);
    List<Coupons> findAllByActiveTrueAndExpiryDateBefore(LocalDateTime now);

}
