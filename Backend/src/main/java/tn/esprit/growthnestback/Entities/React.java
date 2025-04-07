package tn.esprit.growthnestback.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "React")

public class React {



        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)

        long idreact;

        @Enumerated(EnumType.STRING)
        ReactionType type;;

        @ManyToOne
        @JoinColumn(name = "user_id")
        @JsonBackReference(value = "react-user")
        private User user;
        @ManyToOne
        @JoinColumn(name = "post_id", referencedColumnName = "idp")
        @JsonBackReference(value = "react-post")
        private Post post;
}
