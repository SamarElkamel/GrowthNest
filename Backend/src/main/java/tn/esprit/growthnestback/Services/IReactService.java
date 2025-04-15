package tn.esprit.growthnestback.Services;
import org.springframework.security.core.Authentication;
import tn.esprit.growthnestback.DTO.ReactRequest;
import tn.esprit.growthnestback.Entities.React;
import tn.esprit.growthnestback.Entities.ReactionType;

import java.util.List;

public interface IReactService {


    // 🆕 Nouvelle méthode pour ajouter une réaction avec DTO
    React addReact(ReactRequest request);

    void deleteReact(long idreact);
    List<React> getAllReacts();
    List<React> getReactsByPostId(long postId);
    List<React> getReactsByUserId(long userId);
    React getReactById(long idreact);

    void toggleReaction(Long postId, ReactionType newType, Authentication authentication);
}
