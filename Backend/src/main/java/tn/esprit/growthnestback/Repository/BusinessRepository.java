package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.growthnestback.Entities.Business;
@Repository
public interface BusinessRepository extends JpaRepository<Business, Long> {
}
