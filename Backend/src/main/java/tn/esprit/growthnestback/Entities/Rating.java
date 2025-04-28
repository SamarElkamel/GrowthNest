package tn.esprit.growthnestback.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDateTime;

@Entity
@Getter
@Setter@AllArgsConstructor@NoArgsConstructor
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

     int stars;

     String comment;

     LocalDateTime createdAt = LocalDateTime.now();
     @ManyToOne
     User user;


}

