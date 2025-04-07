package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.Reclamation;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
}
