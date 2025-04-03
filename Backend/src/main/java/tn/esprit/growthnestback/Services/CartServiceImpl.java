package tn.esprit.growthnestback.Services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.*;
import tn.esprit.growthnestback.Repository.*;
import tn.esprit.growthnestback.dto.CreateOrderRequestDTO;
import tn.esprit.growthnestback.dto.OrderItemDTO;
import tn.esprit.growthnestback.dto.OrderResponseDTO;
import tn.esprit.growthnestback.dto.OrderDetailDTO;


import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {
    @Autowired
    private  OrderRepository orderRepository;
    @Autowired

    private  UserRepository userRepository;
    @Autowired

    private  ProductRepository productRepository;
    @Autowired

    private  OrderDetailsRepository orderDetailsRepository;
    @Autowired
    private CouponRepository couponRepository ;

    @Override
    public OrderResponseDTO viewCart(Long userId) {
        Order cart = getOrCreateCart(userId);
        return mapOrderToDTO(cart);
    }

    @Override
    public OrderResponseDTO updateItemQuantity(Long userId, Long productId, int quantity) {
        Order cart = getOrCreateCart(userId);
        Optional<OrderDetails> existing = cart.getOrderDetails().stream()
                .filter(d -> d.getProduct().getId().equals(productId))
                .findFirst();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        if (existing.isPresent()) {
            OrderDetails detail = existing.get();
            detail.setQuantity(quantity);
            orderDetailsRepository.save(detail);
        } else {
            OrderDetails newItem = new OrderDetails();
            newItem.setOrder(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setPriceAtTime(product.getPrice().doubleValue());
            orderDetailsRepository.save(newItem);
        }

        return recalculateAndReturn(cart);
    }

    @Override
    public OrderResponseDTO removeItemFromCart(Long userId, Long productId) {
        Order cart = getOrCreateCart(userId);

        cart.getOrderDetails().removeIf(d -> {
            boolean match = d.getProduct().getId().equals(productId);
            if (match) orderDetailsRepository.delete(d);
            return match;
        });

        return recalculateAndReturn(cart);
    }

    @Override
    public void cancelCart(Long userId) {
        Order cart = orderRepository.findByUserIdAndStatus(userId, OrderStatus.CART)
                .orElseThrow(() -> new EntityNotFoundException("No active cart found"));
        cart.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(cart);
    }

    @Override
    public OrderResponseDTO checkoutCart(Long userId) {
        Order cart = orderRepository.findByUserIdAndStatus(userId, OrderStatus.CART)
                .orElseThrow(() -> new EntityNotFoundException("No active cart to checkout"));

        cart.setStatus(OrderStatus.PENDING);
        orderRepository.save(cart);

        return mapOrderToDTO(cart);
    }

    private Order getOrCreateCart(Long userId) {
        return orderRepository.findByUserIdAndStatus(userId, OrderStatus.CART)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new EntityNotFoundException("User not found"));
                    Order order = new Order();
                    order.setUser(user);
                    order.setStatus(OrderStatus.CART);
                    order.setTotalAmount(0.0);
                    return orderRepository.save(order);
                });
    }

    private OrderResponseDTO recalculateAndReturn(Order cart) {
        double total = cart.getOrderDetails().stream()
                .mapToDouble(d -> d.getQuantity() * d.getPriceAtTime())
                .sum();

        cart.setTotalAmount(total);
        orderRepository.save(cart);
        return mapOrderToDTO(cart);
    }

    private OrderResponseDTO mapOrderToDTO(Order order) {
        List<OrderItemDTO> items = order.getOrderDetails().stream()
                .map(d -> new OrderItemDTO(
                        d.getProduct().getId(),
                        d.getProduct().getName(),
                        d.getPriceAtTime(),
                        d.getQuantity()
                )).toList();

        return new OrderResponseDTO(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus().toString(),
                order.getDeliveryAddress(),
                order.getPaymentMethod(),
                items, order.getCoupon() != null ? order.getCoupon().getCode() : null,
                order.getDiscountAmount() != null ? order.getDiscountAmount() : 0.0
        );
    }
    @Override
    @Transactional
    public OrderResponseDTO createOrUpdateCartWithDetails(CreateOrderRequestDTO request) {
        // Step 1: Get or create an active cart
        Order cart = orderRepository.findCartByUserIdAndStatus(request.userId(), OrderStatus.CART)
                .orElseGet(() -> {
                    User user = userRepository.findById(request.userId())
                            .orElseThrow(() -> new EntityNotFoundException("User not found"));
                    Order newCart = new Order();
                    newCart.setUser(user);
                    newCart.setStatus(OrderStatus.CART);
                    newCart.setPaymentMethod(request.paymentMethod());
                    newCart.setDeliveryAddress(request.deliveryAddress());
                    newCart.setTotalAmount(0.0);
                    return orderRepository.save(newCart);
                });

        // Step 2: Merge duplicate items from request
        Map<Long, Integer> mergedItems = request.orderDetails().stream()
                .collect(Collectors.toMap(
                        OrderDetailDTO::productId,
                        OrderDetailDTO::quantity,
                        Integer::sum
                ));

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItemDTO> items = new ArrayList<>();

        for (Map.Entry<Long, Integer> entry : mergedItems.entrySet()) {
            Long productId = entry.getKey();
            Integer quantity = entry.getValue();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + productId));

            Optional<OrderDetails> existingItem = cart.getOrderDetails().stream()
                    .filter(d -> d.getProduct().getId().equals(productId))
                    .findFirst();

            if (existingItem.isPresent()) {
                OrderDetails detail = existingItem.get();
                detail.setQuantity(detail.getQuantity() + quantity);
                orderDetailsRepository.save(detail);
            } else {
                OrderDetails newDetail = new OrderDetails();
                newDetail.setOrder(cart);
                newDetail.setProduct(product);
                newDetail.setQuantity(quantity);
                newDetail.setPriceAtTime(product.getPrice().doubleValue());
                orderDetailsRepository.save(newDetail);
            }

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(quantity)));

            items.add(new OrderItemDTO(
                    product.getId(),
                    product.getName(),
                    product.getPrice().doubleValue(),
                    quantity
            ));
        }

        cart.setTotalAmount(total.doubleValue());
        orderRepository.save(cart);

        return new OrderResponseDTO(
                cart.getId(),
                cart.getTotalAmount(),
                cart.getStatus().toString(),
                cart.getDeliveryAddress(),
                cart.getPaymentMethod(),
                items, cart.getCoupon() != null ? cart.getCoupon().getCode() : null,
                cart.getDiscountAmount() != null ? cart.getDiscountAmount() : 0.0
        );
    }
    @Override
    @Transactional
    public OrderResponseDTO applyCouponToCart(Long userId, String couponCode) {
        // Step 1: Get user's active cart
        Order cart = orderRepository.findCartByUserIdAndStatus(userId, OrderStatus.CART)
                .orElseThrow(() -> new RuntimeException("No active cart found for user"));

        // Step 2: Validate coupon
        Coupons coupon = couponRepository.findByCodeIgnoreCase(couponCode)
                .filter(Coupons::isActive)
                .filter(c -> c.getExpiryDate().isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new RuntimeException("Invalid or expired coupon"));

        // Step 3: Calculate eligible discount
        double subtotal = cart.getOrderDetails().stream()
                .mapToDouble(detail -> detail.getQuantity() * detail.getPriceAtTime())
                .sum();

        double discount = subtotal * (coupon.getDiscountPercentage() / 100.0);
        BigDecimal roundedDiscount = BigDecimal.valueOf(discount).setScale(2, RoundingMode.HALF_UP);

        double totalAfterDiscount = subtotal - discount;

        // Step 4: Apply to cart
        cart.setCoupon(coupon);
        cart.setTotalAmount(totalAfterDiscount);
        cart.setDiscountAmount(roundedDiscount.doubleValue());
        orderRepository.save(cart);

        return mapOrderToDTO(cart);
    }

}

