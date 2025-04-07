package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.growthnestback.Entities.Respons;

@Repository
public interface ResponsRepository extends JpaRepository<Respons, Long> {

}
