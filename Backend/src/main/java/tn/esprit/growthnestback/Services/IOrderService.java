package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Order;
import tn.esprit.growthnestback.Entities.OrderStatus;
import tn.esprit.growthnestback.dto.CreateOrderRequestDTO;
import tn.esprit.growthnestback.dto.OrderResponseDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IOrderService {
    List<OrderResponseDTO> getOrdersForUser(Long userId); // excludes CART

    OrderResponseDTO getOrderById(Long orderId);

    List<OrderResponseDTO> getOrdersByStatus(Long userId, OrderStatus status);
    List<OrderResponseDTO> getUserOrderHistory(Long userId);
    OrderResponseDTO reorder(Long userId, Long originalOrderId);
    public List<OrderResponseDTO> getAllOrdersAsAdmin(String status, Long userId, LocalDate fromDate, LocalDate toDate) ;
    public void updateStatus(Long orderId, String newStatus);
    public List<OrderResponseDTO> getFilteredOrders(OrderStatus status, LocalDateTime start, LocalDateTime end) ;


    }
