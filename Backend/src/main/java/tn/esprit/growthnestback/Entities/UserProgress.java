package tn.esprit.growthnestback.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class UserProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id ;
    @OneToOne
    private User user;

    private int totalPoints;
    private String badge;
    private LocalDateTime lastUpdated;

}
