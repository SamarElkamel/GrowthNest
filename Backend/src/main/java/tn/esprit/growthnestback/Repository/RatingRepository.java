package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    }

