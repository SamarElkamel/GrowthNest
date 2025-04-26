package tn.esprit.growthnestback.Controller;


import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Order;
import tn.esprit.growthnestback.Entities.OrderStatus;
import tn.esprit.growthnestback.Services.IOrderService;
import tn.esprit.growthnestback.dto.CreateOrderRequestDTO;
import tn.esprit.growthnestback.dto.OrderResponseDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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

    //@CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/admin")
        public ResponseEntity<List<OrderResponseDTO>> getAllOrders(
                @RequestParam(required = false) String status,
                @RequestParam(required = false) Long userId,
                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
        ) {
            List<OrderResponseDTO> orders = orderService.getAllOrdersAsAdmin(status, userId, fromDate, toDate);
            return ResponseEntity.ok(orders);
        }


    @PatchMapping ("/admin/orders/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        orderService.updateStatus(id, newStatus);
        System.out.println(newStatus);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/admin/orders")
    public ResponseEntity<List<OrderResponseDTO>> getFilteredOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        List<OrderResponseDTO> filtered = orderService.getFilteredOrders(status, startDate, endDate);
        return ResponseEntity.ok(filtered);
    }

}


