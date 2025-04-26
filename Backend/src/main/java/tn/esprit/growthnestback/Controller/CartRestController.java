package tn.esprit.growthnestback.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tn.esprit.growthnestback.Entities.UserPoints;
import tn.esprit.growthnestback.Repository.UserPointsRepository;
import tn.esprit.growthnestback.Services.CartServiceImpl;
import tn.esprit.growthnestback.dto.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartRestController {

   @Autowired
    private CartServiceImpl cartService;

    @Autowired
    private UserPointsRepository userPointsRepo ;

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

   /* @GetMapping("/points/{userId}")
    public ResponseEntity<UserPointsDTO> getUserPoints(@PathVariable Long userId) {
        UserPoints points = userPointsRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        int available = points.getTotalPoints() - points.getRedeemedPoints();
        return ResponseEntity.ok(new UserPointsDTO(
                points.getTotalPoints(),
                points.getRedeemedPoints(),
                available
        ));
    }*/
    @PostMapping("/apply-points")
    public ResponseEntity<Map<String, Object>> applyPoints(@RequestBody RedeemPointsRequest request) {
        UserPoints points = userPointsRepo.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        int available = points.getTotalPoints() - points.getRedeemedPoints();

        if (request.pointsToRedeem() > available) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Insufficient points"));
        }

        BigDecimal discount = BigDecimal.valueOf(request.pointsToRedeem() * 0.01); // 100 pts = 1 TND
        BigDecimal newTotal = request.cartTotal().subtract(discount);

        return ResponseEntity.ok(Map.of(
                "discount", discount,
                "newTotal", newTotal
        ));
    }

}
