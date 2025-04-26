package tn.esprit.growthnestback.Services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.OrderDetails;
import tn.esprit.growthnestback.Repository.OrderDetailsRepository;

import java.util.List;
@Service
@RequiredArgsConstructor

public class OrderDetailsImp implements IOrderDetailsService {

   @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Override
    public OrderDetails addOrderDetail(OrderDetails orderDetail) {
        return orderDetailsRepository.save(orderDetail);
    }

    @Override
    public OrderDetails updateOrderDetail(Long id, OrderDetails updatedDetail) {
        OrderDetails existing = orderDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderDetail not found with id " + id));

        existing.setQuantity(updatedDetail.getQuantity());
        existing.setPriceAtTime(updatedDetail.getPriceAtTime());
        existing.setOrder(updatedDetail.getOrder());
        existing.setProduct(updatedDetail.getProduct());

        return orderDetailsRepository.save(existing);
    }

    @Override
    public void deleteOrderDetail(Long id) {
        orderDetailsRepository.deleteById(id);
    }

    @Override
    public OrderDetails getOrderDetail(Long id) {
        return orderDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderDetail not found with id " + id));
    }

    @Override
    public List<OrderDetails> getAllOrderDetails() {
        return orderDetailsRepository.findAll();
    }

    @Override
    public List<OrderDetails> getOrderDetailsByOrderId(Long orderId) {
        return orderDetailsRepository.findByOrderId(orderId);
    }

}
