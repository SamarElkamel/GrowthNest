package tn.esprit.growthnestback.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Wishlist;
import tn.esprit.growthnestback.dto.WishlistDTO;
import tn.esprit.growthnestback.Entities.ErrorResponse;
import tn.esprit.growthnestback.Services.IWishlistService;

import jakarta.validation.constraints.Positive;
import java.util.List;

@RestController
@Tag(name = "gestion de la wishlist")
@RequestMapping("/wishlist")
public class WishlistRestController {
    @Autowired
    private IWishlistService wishlistService;

    @Operation(description = "Ajouter un produit à la wishlist")
    @PostMapping("/add/{userId}/{productId}")
    public ResponseEntity<?> addToWishlist(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long productId) {
        try {
            Wishlist wishlist = wishlistService.addToWishlist(userId, productId);
            return ResponseEntity.ok(wishlist);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()));
        }
    }

    @Operation(description = "Supprimer un produit de la wishlist")
    @DeleteMapping("/remove/{userId}/{productId}")
    public ResponseEntity<?> removeFromWishlist(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long productId) {
        try {
            wishlistService.removeFromWishlist(userId, productId);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(HttpStatus.NOT_FOUND, e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()));
        }
    }

    @Operation(description = "Récupérer la wishlist d'un utilisateur")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getWishlistByUserId(@PathVariable @Positive Long userId) {
        try {
            List<WishlistDTO> wishlist = wishlistService.getWishlistByUserId(userId);
            return ResponseEntity.ok(wishlist);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error: " + e.getMessage()));
        }
    }

    @Operation(description = "Vérifier si un produit est dans la wishlist")
    @GetMapping("/check/{userId}/{productId}")
    public ResponseEntity<?> isProductInWishlist(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long productId) {
        try {
            boolean isInWishlist = wishlistService.isProductInWishlist(userId, productId);
            return ResponseEntity.ok(isInWishlist);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error: " + e.getMessage()));
        }
    }
}