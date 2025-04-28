package tn.esprit.growthnestback.Services;
import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@ToString
@Builder

public class Notification {

    private NotificationStatus status;
    private String message;
    private String Reclamationtitle;
}
