package tn.esprit.growthnestback.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Services.CartServiceImpl;
import tn.esprit.growthnestback.dto.CreateOrderRequestDTO;
import tn.esprit.growthnestback.dto.OrderResponseDTO;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartRestController {

   @Autowired
    private CartServiceImpl cartService;


    @PostMapping("/add-items")
    public ResponseEntity<OrderResponseDTO> addOrUpdateCartItems(@RequestBody CreateOrderRequestDTO request) {
        OrderResponseDTO updatedCart = cartService.createOrUpdateCartWithDetails(request);
        return ResponseEntity.ok(updatedCart);
    }
    // View current cart
    @GetMapping("/{userId}")
    public ResponseEntity<OrderResponseDTO> viewCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.viewCart(userId));
    }

    // Update quantity of a specific product
    @PatchMapping("/item/{productId}")
    public ResponseEntity<OrderResponseDTO> updateItemQuantity(
            @RequestParam Long userId,
            @PathVariable Long productId,
            @RequestParam int quantity
    ) {
        return ResponseEntity.ok(cartService.updateItemQuantity(userId, productId, quantity));
    }

    // Remove item from cart
    @DeleteMapping("/item/{productId}")
    public ResponseEntity<OrderResponseDTO> removeItemFromCart(
            @RequestParam Long userId,
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(cartService.removeItemFromCart(userId, productId));
    }

    // Cancel entire cart
    @DeleteMapping
    public ResponseEntity<Void> cancelCart(@RequestParam Long userId) {
        cartService.cancelCart(userId);
        return ResponseEntity.noContent().build();
    }

    // Checkout cart
    @PostMapping("/checkout")
    public ResponseEntity<OrderResponseDTO> checkoutCart(@RequestParam Long userId) {
        return ResponseEntity.ok(cartService.checkoutCart(userId));
    }
    @PostMapping("/apply-coupon")
    public ResponseEntity<OrderResponseDTO> applyCouponToCart(
            @RequestParam Long userId,
            @RequestParam String code
    ) {
        return ResponseEntity.ok(cartService.applyCouponToCart(userId, code));
    }

}
