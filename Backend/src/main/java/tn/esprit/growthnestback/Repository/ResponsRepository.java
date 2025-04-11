package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.growthnestback.Entities.Respons;

import java.util.List;

@Repository
public interface ResponsRepository extends JpaRepository<Respons, Long> {
    List<Respons> findResponsByPost_Idp(Long pId);
}
