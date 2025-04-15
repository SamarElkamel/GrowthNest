package tn.esprit.growthnestback.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long reclamationId;

    @Enumerated(EnumType.STRING)
    ReclamationType type;

    @NotBlank(message = "The description is required")
    @Size(min = 10, max = 255, message = "The description must be between 10 and 255 characters")
    String description;

    @Temporal(TemporalType.TIMESTAMP)
    Date reclamationDate;

    @Enumerated(EnumType.STRING)
    ReclamationStatus status = ReclamationStatus.PENDING;
}
