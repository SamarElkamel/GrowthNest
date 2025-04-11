package tn.esprit.growthnestback.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponsRequest {
    private Long postId;
    private String respons; // 🟢 Même nom que dans l'entité
}