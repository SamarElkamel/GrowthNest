package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
