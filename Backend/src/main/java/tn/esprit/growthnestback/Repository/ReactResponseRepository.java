package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.ReactResponse;
import tn.esprit.growthnestback.Entities.Respons;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Entities.Reaction;

import java.util.List;
import java.util.Optional;

public interface ReactResponseRepository extends JpaRepository<ReactResponse, Long> {

    // 📌 Récupérer toutes les réactions d'une réponse
    List<ReactResponse> findByRespons_Id(Long responsId);

    // 📌 Récupérer toutes les réactions d'un user
    List<ReactResponse> findByUser_Id(Long userId);

    // 📌 Compter combien de réactions de type LIKE, LOVE, etc. sur une réponse
    long countByRespons_IdAndType(Long responsId, Reaction type);

    // 📌 Chercher si un utilisateur a déjà réagi sur une réponse
    Optional<ReactResponse> findByUserAndRespons(User user, Respons respons);
}
