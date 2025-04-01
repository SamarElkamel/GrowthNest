package tn.esprit.growthnestback.Controller;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Order;
import tn.esprit.growthnestback.Services.IOrderService;
import tn.esprit.growthnestback.dto.CreateOrderRequestDTO;
import tn.esprit.growthnestback.dto.OrderResponseDTO;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/orders")
public class OrderRestController {
    private IOrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order) {
        return ResponseEntity.ok(orderService.updateOrder(id, order));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PostMapping("/full")
    public ResponseEntity<OrderResponseDTO> createFullOrder(@RequestBody CreateOrderRequestDTO request) {
        OrderResponseDTO response = orderService.createOrderWithDetails(request);
        return ResponseEntity.ok(response);
    }

}
