package tn.esprit.growthnestback.Services;
import tn.esprit.growthnestback.DTO.ReactRequest;
import tn.esprit.growthnestback.Entities.React;

import java.util.List;

public interface IReactService {


    // 🆕 Nouvelle méthode pour ajouter une réaction avec DTO
    React addReact(ReactRequest request);

    void deleteReact(long idreact);
    List<React> getAllReacts();
    List<React> getReactsByPostId(long postId);
    List<React> getReactsByUserId(long userId);
    React getReactById(long idreact);
}
