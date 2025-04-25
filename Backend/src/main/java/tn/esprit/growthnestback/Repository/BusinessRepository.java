package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.esprit.growthnestback.Entities.Business;

import java.util.List;

@Repository
public interface BusinessRepository extends JpaRepository<Business, Long> {
    @Query("SELECT b FROM Business b WHERE b.averageRating IS NOT NULL ORDER BY b.averageRating DESC")
    List<Business> findTopThreeByAverageRating();
}
