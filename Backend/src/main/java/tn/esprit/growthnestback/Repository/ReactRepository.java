package tn.esprit.growthnestback.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.*;

import java.util.List;
import java.util.Optional;

public interface ReactRepository extends JpaRepository<React, Long> {
    List<React> findByPost_Idp(Long postId);
    List<React> findByUser_Id(Long id);
    long countByPost_IdpAndType(Long postId, ReactionType type);
    long countByPost_TagsAndType(Tags tag, ReactionType type);
    Optional<React> findByUserAndPost(User user, Post post);
}