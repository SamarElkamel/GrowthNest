package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Order;
import tn.esprit.growthnestback.Entities.OrderStatus;
import tn.esprit.growthnestback.dto.CreateOrderRequestDTO;
import tn.esprit.growthnestback.dto.OrderResponseDTO;

import java.util.List;

public interface IOrderService {
    List<OrderResponseDTO> getOrdersForUser(Long userId); // excludes CART

    OrderResponseDTO getOrderById(Long orderId);

    List<OrderResponseDTO> getOrdersByStatus(Long userId, OrderStatus status);
    List<OrderResponseDTO> getUserOrderHistory(Long userId);
    OrderResponseDTO reorder(Long userId, Long originalOrderId);


}
