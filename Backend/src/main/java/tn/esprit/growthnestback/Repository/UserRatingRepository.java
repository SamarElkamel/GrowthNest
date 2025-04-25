package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.UserRating;

import java.util.Optional;

public interface UserRatingRepository extends JpaRepository<UserRating, Long> {
    Optional<UserRating> findByUserIdAndBusinessId(Long userId, Long businessId);
}
