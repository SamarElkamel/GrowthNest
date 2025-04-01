package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Order;
import tn.esprit.growthnestback.dto.CreateOrderRequestDTO;
import tn.esprit.growthnestback.dto.OrderResponseDTO;

import java.util.List;

public interface IOrderService {
    Order createOrder(Order order);
    Order updateOrder(Long id, Order order);
    void deleteOrder(Long id);
    Order getOrderById(Long id);
    List<Order> getAllOrders();
    OrderResponseDTO createOrderWithDetails(CreateOrderRequestDTO requestDTO);

}
