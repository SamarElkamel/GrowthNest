package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.DeliveryAgency;

public interface DeliveryAgencyRepository extends JpaRepository<DeliveryAgency, Long> {
}
