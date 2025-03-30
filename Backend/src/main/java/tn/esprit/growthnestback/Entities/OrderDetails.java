package tn.esprit.growthnestback.Entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "orderDetails")

public class OrderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     Long id;

     Integer quantity;
     Double priceAtTime;
     Double discountApplied;

    @ManyToOne
    @JoinColumn(name = "order_id")
     Order order;
    @ManyToOne
    @JoinColumn(name = "product_id")
     Product product;
}
