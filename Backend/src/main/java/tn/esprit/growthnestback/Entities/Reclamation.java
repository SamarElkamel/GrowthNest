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

    @NotBlank(message = "The complaint type is required")
    @Size(min = 3, max = 50, message = "The type must be between 3 and 50 characters")
    String type;

    @NotBlank(message = "The description is required")
    @Size(min = 10, max = 255, message = "The description must be between 10 and 255 characters")
    String description;

    @Temporal(TemporalType.TIMESTAMP)
    Date reclamationDate;
}
