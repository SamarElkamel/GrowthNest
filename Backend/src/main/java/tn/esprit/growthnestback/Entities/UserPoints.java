package tn.esprit.growthnestback.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserPoints {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long userId;

    private int totalPoints;
    private int redeemedPoints;
}
