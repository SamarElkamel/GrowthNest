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

    @Override
    public Order createOrder(Order order) {
         return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Long id, Order updatedOrder) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id " + id));
        existing.setStatus(updatedOrder.getStatus());
        existing.setTotalAmount(updatedOrder.getTotalAmount());
        existing.setPaymentMethod(updatedOrder.getPaymentMethod());
        existing.setDeliveryAddress(updatedOrder.getDeliveryAddress());
        existing.setUser(updatedOrder.getUser());
        return orderRepository.save(existing);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id " + id));
    }

    @Override
    public List<Order> getAllOrders() {
          return orderRepository.findAll();
    }

    @Override
    @Transactional
    public OrderResponseDTO createOrderWithDetails(CreateOrderRequestDTO request) {
        // Step 1: Fetch user
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + request.userId()));

        // Step 2: Create initial order
        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.CART);
        order.setPaymentMethod(request.paymentMethod());
        order.setDeliveryAddress(request.deliveryAddress());

        Order savedOrder = orderRepository.save(order);

        // Step 3: Merge duplicates
        Map<Long, Integer> mergedItems = request.orderDetails().stream()
                .collect(Collectors.toMap(
                        OrderDetailDTO::productId,
                        OrderDetailDTO::quantity,
                        Integer::sum // merge duplicate product IDs
                ));

        // Step 4: Save order details and calculate total
        BigDecimal total = BigDecimal.ZERO;
        List<OrderItemDTO> items = new ArrayList<>();

        for (Map.Entry<Long, Integer> entry : mergedItems.entrySet()) {
            Long productId = entry.getKey();
            Integer quantity = entry.getValue();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + productId));

            OrderDetails detail = new OrderDetails();
            detail.setOrder(savedOrder);
            detail.setProduct(product);
            detail.setQuantity(quantity);
            detail.setPriceAtTime(product.getPrice().doubleValue());

            orderDetailsRepository.save(detail);

            // Update total
            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
            total = total.add(lineTotal);

            // Add to response DTO list
            items.add(new OrderItemDTO(
                    product.getId(),
                    product.getName(),
                    product.getPrice().doubleValue(),
                    quantity
            ));
        }

        // Step 5: Set total and return DTO
        savedOrder.setTotalAmount(total.doubleValue());
        orderRepository.save(savedOrder);

        return new OrderResponseDTO(
                savedOrder.getId(),
                total.doubleValue(),
                savedOrder.getStatus().toString(),
                savedOrder.getDeliveryAddress(),
                savedOrder.getPaymentMethod(),
                items
        );
    }

}
