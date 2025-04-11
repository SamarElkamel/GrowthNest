package tn.esprit.growthnestback.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.React;
import tn.esprit.growthnestback.Entities.ReactionType;

import java.util.List;

public interface ReactRepository extends JpaRepository<React, Long> {
    List<React> findByPost_Idp(Long postId);
    List<React> findByUser_Id(Long id);
    long countByPost_IdpAndType(Long postId, ReactionType type);

}