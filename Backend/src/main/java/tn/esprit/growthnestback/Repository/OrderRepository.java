package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.growthnestback.Entities.Order;
import tn.esprit.growthnestback.Entities.OrderStatus;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status = :status")
    Optional<Order> findCartByUserIdAndStatus(@Param("userId") Long userId, @Param("status") OrderStatus status);

    List<Order> findAllById(Long userId);
    List<Order> findAllByUserIdAndStatusNot(Long userId, OrderStatus status);

    List<Order> findAllByUserIdAndStatus(Long userId, OrderStatus status);

}
