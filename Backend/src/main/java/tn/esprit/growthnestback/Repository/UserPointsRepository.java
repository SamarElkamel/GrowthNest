package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.UserPoints;

public interface UserPointsRepository extends JpaRepository<UserPoints, Long> {
}
