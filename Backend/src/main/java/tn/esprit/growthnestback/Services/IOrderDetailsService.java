package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.OrderDetails;

import java.util.List;

public interface IOrderDetailsService {
    OrderDetails addOrderDetail(OrderDetails orderDetail);
    OrderDetails updateOrderDetail(Long id, OrderDetails updatedDetail);
    void deleteOrderDetail(Long id);
    OrderDetails getOrderDetail(Long id);
    List<OrderDetails> getAllOrderDetails();
    List<OrderDetails> getOrderDetailsByOrderId(Long orderId);
}
