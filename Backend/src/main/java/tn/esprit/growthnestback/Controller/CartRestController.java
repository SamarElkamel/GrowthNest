package tn.esprit.growthnestback.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Services.CartServiceImpl;
import tn.esprit.growthnestback.dto.*;

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
            @PathVariable Long productId,
            @RequestBody UpdateItemDTO request    ) {
        return ResponseEntity.ok(cartService.updateItemQuantity(request.userId(), productId, request.quantity() ));
    }

    // Remove item from cart
    @DeleteMapping("/item/{productId}")
    public ResponseEntity<OrderResponseDTO> removeItemFromCart(
            @RequestBody CartUserDTO request ,
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(cartService.removeItemFromCart(request.userId(), productId));
    }

    // Cancel entire cart
    @DeleteMapping
    public ResponseEntity<Void> cancelCart(@RequestBody CartUserDTO request) {
        cartService.cancelCart(request.userId());
        return ResponseEntity.noContent().build();
    }

    // Checkout cart
    @PostMapping("/checkout")
    public ResponseEntity<OrderResponseDTO> checkoutCart(@RequestParam Long userId) {
        return ResponseEntity.ok(cartService.checkoutCart(userId));
    }
    @PostMapping("/apply-coupon")
    public ResponseEntity<OrderResponseDTO> applyCouponToCart(
            @RequestBody ApplyCouponDTO request

    ) {
        return ResponseEntity.ok(cartService.applyCouponToCart(request.userId(), request.couponCode()));
    }
    @PostMapping("/checkoutUser")
    public ResponseEntity<OrderResponseDTO> checkoutCartUser(@RequestBody CheckoutDTO request) {
        return ResponseEntity.ok(cartService.checkoutCartUser(
                request.userId(),
                request.deliveryAddress(),
                request.paymentMethod()
        ));
    }

}
