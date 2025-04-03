package tn.esprit.growthnestback.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "coupons")
public class Coupons {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    private Double discountPercentage;
    @Column(name = "expire_date", nullable = false)
    private LocalDateTime expiryDate;

    private boolean active = true;

    private boolean global = true;

    @ManyToOne
    private User owner;

    @ManyToMany
    private List<Product> applicableProducts;
    private Integer maxUses;
    private Integer usageCount = 0;
}
