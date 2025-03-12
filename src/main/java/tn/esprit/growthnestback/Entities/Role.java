package tn.esprit.growthnestback.Entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity

@Table(name="role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private RoleName name;

    @JsonIgnore
    @OneToMany (mappedBy="role")
    private List<User> users ;

    /*@CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;
    @org.springframework.data.annotation.LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime LastModifiedDate;

    @PrePersist
    public void onCreate() {
        this.createdDate = LocalDateTime.now();
    }*/

}
