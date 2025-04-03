package tn.esprit.growthnestback.Controller;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Order;
import tn.esprit.growthnestback.Entities.OrderStatus;
import tn.esprit.growthnestback.Services.IOrderService;
import tn.esprit.growthnestback.dto.CreateOrderRequestDTO;
import tn.esprit.growthnestback.dto.OrderResponseDTO;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/orders")
public class OrderRestController {
    private IOrderService orderService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getAllUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersForUser(userId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @GetMapping("/user/{userId}/status")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByStatus(
            @PathVariable Long userId,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(userId, status));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getOrderHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrderHistory(userId));
    }
    @PostMapping("/reorder/{orderId}")
    public ResponseEntity<OrderResponseDTO> reorder(
            @PathVariable Long orderId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(orderService.reorder(userId, orderId));
    }

}
