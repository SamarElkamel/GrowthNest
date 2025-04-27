package tn.esprit.growthnestback.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.DTO.ReactResponseRequest;
import tn.esprit.growthnestback.Entities.ReactResponse;
import tn.esprit.growthnestback.Entities.Reaction;
import tn.esprit.growthnestback.Services.IReactResponseService;

import java.util.List;

@RestController
@RequestMapping("/api/react-responses")
@RequiredArgsConstructor
public class ReactResponseController {

    private final IReactResponseService reactResponseService;

    // ➕ Ajouter ou basculer une réaction sur une réponse
    @PostMapping("/add")
    public ResponseEntity<ReactResponse> addOrUpdateReactResponse(@RequestBody ReactResponseRequest request, Authentication authentication) {
        Reaction type;
        try {
            type = Reaction.valueOf(request.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }

        ReactResponse reactResponse = reactResponseService.toggleReaction(request.getResponsId(), type, authentication);
        if (reactResponse == null) {
            return ResponseEntity.ok(null); // Reaction was removed
        }
        return ResponseEntity.ok(reactResponse);
    }

    // ❌ Supprimer une réaction
    @DeleteMapping("/delete/{id}")
    public void deleteReactResponse(@PathVariable("id") long idReactResponse) {
        reactResponseService.deleteReactResponse(idReactResponse);
    }

    // 📋 Afficher toutes les réactions
    @GetMapping("/all")
    public List<ReactResponse> getAllReactResponses() {
        return reactResponseService.getAllReactResponses();
    }

    // 📋 Récupérer par ID
    @GetMapping("/{id}")
    public ReactResponse getReactResponseById(@PathVariable("id") long id) {
        return reactResponseService.getReactResponseById(id);
    }

    // 📋 Récupérer toutes les réactions sur une réponse spécifique
    @GetMapping("/respons/{responsId}")
    public List<ReactResponse> getReactResponsesByRespons(@PathVariable("responsId") long responsId) {
        return reactResponseService.getReactResponsesByResponsId(responsId);
    }

    // 📋 Récupérer toutes les réactions d'un utilisateur
    @GetMapping("/user/{userId}")
    public List<ReactResponse> getReactResponsesByUser(@PathVariable("userId") long userId) {
        return reactResponseService.getReactResponsesByUserId(userId);
    }
}
