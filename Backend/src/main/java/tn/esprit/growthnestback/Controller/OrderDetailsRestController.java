package tn.esprit.growthnestback.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.OrderDetails;
import tn.esprit.growthnestback.Services.OrderDetailsImp;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
@RequiredArgsConstructor
public class OrderDetailsRestController {

    @Autowired
    private OrderDetailsImp orderDetailsService;

    @PostMapping
    public ResponseEntity<OrderDetails> add(@RequestBody OrderDetails detail) {
        return ResponseEntity.ok(orderDetailsService.addOrderDetail(detail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDetails> update(@PathVariable Long id, @RequestBody OrderDetails detail) {
        return ResponseEntity.ok(orderDetailsService.updateOrderDetail(id, detail));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderDetailsService.deleteOrderDetail(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetails> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderDetailsService.getOrderDetail(id));
    }

    @GetMapping
    public ResponseEntity<List<OrderDetails>> getAll() {
        return ResponseEntity.ok(orderDetailsService.getAllOrderDetails());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetails>> getByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderDetailsService.getOrderDetailsByOrderId(orderId));
    }
}

