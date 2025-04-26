package tn.esprit.growthnestback.Controller;


import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.growthnestback.Entities.Order;
import tn.esprit.growthnestback.Entities.OrderStatus;
import tn.esprit.growthnestback.Repository.OrderRepository;
import tn.esprit.growthnestback.Services.EmailService;
import tn.esprit.growthnestback.dto.ConfirmOrderDTO;
import tn.esprit.growthnestback.dto.PayementRequestDTO;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PayementController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;
     @Autowired
     private OrderRepository orderRepository ;
    @Autowired
private EmailService mailService ;
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    @PostMapping("/create-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody PayementRequestDTO request) throws StripeException {
        Map<String, Object> params = new HashMap<>();
        params.put("amount", (int) (request.amount() * 100));
        params.put("currency", "usd");
        params.put("metadata", Map.of(
                "userId", String.valueOf(request.userId()),
                "cartId", String.valueOf(request.cartId())
        ));

        PaymentIntent intent = PaymentIntent.create(params);

        return ResponseEntity.ok(Map.of("clientSecret", intent.getClientSecret()));
    }

    @PostMapping("/confirm-order")
    public ResponseEntity<?> confirmStripeOrder(@RequestBody ConfirmOrderDTO dto) {
        Order order = orderRepository.findById(dto.cartId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaymentMethod(dto.paymentMethod());
        order.setDeliveryAddress(dto.deliveryAddress());
        order.setOrderDate(LocalDateTime.now());

        orderRepository.save(order);

        // Email content (reuse your same email logic)
        String html = """
    <html>
      <body>
        <h1>Thank you for your payment, %s!</h1>
        <p>Your order #%d has been confirmed via Stripe.</p>
        <p>Total: $%.2f</p>
      </body>
    </html>
    """.formatted(
                order.getUser().getFirstname(),
                order.getId(),
                order.getTotalAmount()
        );

        mailService.sendHtmlOrderConfirmation(order.getUser().getEmail(), "Your GrowthNest Stripe Confirmation", html);

        //points.earnSeedsFromOrder(order.getUser().getId(), order.getTotalAmount());

        return ResponseEntity.ok(Map.of("message", "Order confirmed and processed."));
    }

}

