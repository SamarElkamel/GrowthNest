package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.dto.CreateOrderRequestDTO;
import tn.esprit.growthnestback.dto.OrderResponseDTO;

public interface ICartService {
    OrderResponseDTO viewCart(Long userId);
    OrderResponseDTO updateItemQuantity(Long userId, Long productId, int quantity);
    OrderResponseDTO removeItemFromCart(Long userId, Long productId);
    void cancelCart(Long userId);
    OrderResponseDTO checkoutCart(Long userId);
    OrderResponseDTO createOrUpdateCartWithDetails(CreateOrderRequestDTO request);

}
