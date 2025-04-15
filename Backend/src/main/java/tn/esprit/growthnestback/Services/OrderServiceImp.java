package tn.esprit.growthnestback.Services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.*;
import tn.esprit.growthnestback.Repository.OrderDetailsRepository;
import tn.esprit.growthnestback.Repository.OrderRepository;
import tn.esprit.growthnestback.Repository.ProductRepository;
import tn.esprit.growthnestback.Repository.UserRepository;
import tn.esprit.growthnestback.dto.CreateOrderRequestDTO;
import tn.esprit.growthnestback.dto.OrderDetailDTO;
import tn.esprit.growthnestback.dto.OrderItemDTO;
import tn.esprit.growthnestback.dto.OrderResponseDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class OrderServiceImp implements IOrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private  ProductRepository productRepository;
    @Autowired
    private  OrderDetailsRepository orderDetailsRepository;
    @Autowired
    private  UserRepository userRepository;


    private OrderResponseDTO mapOrderToDTO(Order order) {
        List<OrderItemDTO> items = order.getOrderDetails().stream()
                .map(detail -> new OrderItemDTO(
                        detail.getProduct().getId(),
                        detail.getProduct().getName(),
                        detail.getPriceAtTime(),
                        detail.getQuantity()
                ))
                .toList();

        return new OrderResponseDTO(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus().toString(),
                order.getDeliveryAddress(),
                order.getPaymentMethod(),
                items ,order.getCoupon() != null ? order.getCoupon().getCode() : null,
                order.getDiscountAmount() != null ? order.getDiscountAmount() : 0.0

        );
    }

  @Override
    public List<OrderResponseDTO> getOrdersForUser(Long userId) {
        return orderRepository.findAllByUserIdAndStatusNot(userId, OrderStatus.CART).stream()
                .map(this::mapOrderToDTO)
                .toList();
    }

    @Override
    public List<OrderResponseDTO> getOrdersByStatus(Long userId, OrderStatus status) {
        return orderRepository.findAllByUserIdAndStatus(userId, status).stream()
                .map(this::mapOrderToDTO)
                .toList();
    }

    @Override
    public OrderResponseDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        return mapOrderToDTO(order);
    }
    @Override
    public List<OrderResponseDTO> getUserOrderHistory(Long userId) {
        return orderRepository.findAllByUserIdAndStatusNot(userId, OrderStatus.CART).stream()
                .map(this::mapOrderToDTO)
                .toList();
    }
    @Override
    @Transactional
    public OrderResponseDTO reorder(Long userId, Long originalOrderId) {
        Order original = orderRepository.findById(originalOrderId)
                .orElseThrow(() -> new EntityNotFoundException("Original order not found"));

        if (!original.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("This order does not belong to the user.");
        }
        Order cart = orderRepository.findCartByUserIdAndStatus(userId, OrderStatus.CART)
                .orElseGet(() -> {
                    Order newCart = new Order();
                    newCart.setUser(original.getUser());
                    newCart.setStatus(OrderStatus.CART);
                    newCart.setPaymentMethod(original.getPaymentMethod());
                    newCart.setDeliveryAddress(original.getDeliveryAddress());
                    newCart.setTotalAmount(0.0);
                    return orderRepository.save(newCart);
                });
        orderDetailsRepository.deleteAll(cart.getOrderDetails());
        cart.getOrderDetails().clear();
        BigDecimal total = BigDecimal.ZERO;
        List<OrderItemDTO> items = new ArrayList<>();

        for (OrderDetails detail : original.getOrderDetails()) {
            OrderDetails newDetail = new OrderDetails();
            newDetail.setOrder(cart);
            newDetail.setProduct(detail.getProduct());
            newDetail.setQuantity(detail.getQuantity());
            newDetail.setPriceAtTime(detail.getProduct().getPrice().doubleValue());

            orderDetailsRepository.save(newDetail);

            total = total.add(detail.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(detail.getQuantity())));

            items.add(new OrderItemDTO(
                    detail.getProduct().getId(),
                    detail.getProduct().getName(),
                    detail.getProduct().getPrice().doubleValue(),
                    detail.getQuantity()
            ));
        }

        cart.setTotalAmount(total.doubleValue());
        orderRepository.save(cart);

        return new OrderResponseDTO(
                cart.getId(),
                total.doubleValue(),
                cart.getStatus().toString(),
                cart.getDeliveryAddress(),
                cart.getPaymentMethod(),
                items , cart.getCoupon() != null ? cart.getCoupon().getCode() : null,
                cart.getDiscountAmount() != null ? cart.getDiscountAmount() : 0.0
        );
    }
    @Override
    public List<OrderResponseDTO> getAllOrdersAsAdmin(String status, Long userId, LocalDate fromDate, LocalDate toDate) {
        return orderRepository.findAll().stream()
                .filter(order -> status == null || order.getStatus().name().equalsIgnoreCase(status))
                .filter(order -> userId == null || order.getUser().getId().equals(userId))
                .filter(order -> {
                    if (fromDate != null && toDate != null) {
                        LocalDate orderDate = order.getOrderDate().toLocalDate();
                        return (orderDate.isEqual(fromDate) || orderDate.isAfter(fromDate)) &&
                                (orderDate.isEqual(toDate) || orderDate.isBefore(toDate));
                    }
                    return true;
                })
                .map(this::mapOrderToDTO)
                .toList();
    }
    @Override
    @Transactional
    public void updateStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        order.setStatus(OrderStatus.valueOf(newStatus));
        System.out.println("Updating order ID " + orderId + " to status " + newStatus);

        orderRepository.save(order);
    }

    @Override
    public List<OrderResponseDTO> getFilteredOrders(OrderStatus status, LocalDateTime start, LocalDateTime end) {
        List<Order> filteredOrders = orderRepository.findFilteredOrders(status, start, end);
        return filteredOrders.stream()
                .map(this::mapOrderToDTO)
                .toList();
    }



}
