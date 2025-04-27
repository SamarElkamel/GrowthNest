package tn.esprit.growthnestback.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReactResponseRequest {
    private Long responsId;   // ID de la réponse (Respons)
    private String type;      // Type de la réaction (LIKE, LOVE, etc.)
}
