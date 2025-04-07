package tn.esprit.growthnestback.Entities;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name="Respons")
public class Respons {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    String respons;
    @Column(updatable = false)  // Prevent updates
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonBackReference(value = "respons-user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id", referencedColumnName = "idp")
    @JsonBackReference(value = "respons-post")
    private Post post;




}
