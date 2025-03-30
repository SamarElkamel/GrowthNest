package tn.esprit.growthnestback.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Order;
import tn.esprit.growthnestback.Repository.OrderRepository;

import java.util.List;
@Service

public class OrderServiceImp implements OrderService{

    @Autowired
    private OrderRepository orderRepository;
    @Override
    public Order createOrder(Order order) {
         return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Long id, Order order) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id " + id));
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
}
