package tn.esprit.growthnestback.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

    @Entity
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @Table(name = "ReactResponse")
    public class ReactResponse {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        long idReactResponse;

        @Enumerated(EnumType.STRING)
        private Reaction type; // 👍 ❤️ 😂 etc.

        @ManyToOne
        @JoinColumn(name = "user_id")
        @JsonBackReference(value = "reactresponse-user")
        private User user;

        @ManyToOne
        @JoinColumn(name = "respons_id")
        @JsonBackReference(value = "reactresponse-respons")
        private Respons respons;

        private LocalDateTime createdAt;

        @PrePersist
        protected void onCreate() {
            createdAt = LocalDateTime.now();
        }
    }


