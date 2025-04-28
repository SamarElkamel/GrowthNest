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
    @Query("SELECT COUNT(b) FROM Business b")
    long countTotalBusinesses();

    @Query("SELECT COUNT(b) FROM Business b WHERE b.status = 'PENDING'")
    long countPendingBusinesses();

    @Query("SELECT COUNT(b) FROM Business b WHERE b.status = 'APPROVED'")
    long countApprovedBusinesses();

    @Query("SELECT COUNT(b) FROM Business b WHERE b.status = 'REJECTED'")
    long countRejectedBusinesses();

    @Query("SELECT AVG(b.averageRating) FROM Business b")
    Double getAverageRating();

    @Query("SELECT COUNT(b) FROM Business b WHERE b.averageRating >= 4.0")
    long countHighRatingBusinesses();
    List<Business> findByUserId(Long userId);


}
