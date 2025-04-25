package tn.esprit.growthnestback.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Wishlist;
import tn.esprit.growthnestback.Services.IWishlistService;

import java.util.List;

@RestController
@Tag(name = "gestion de la wishlist")
@RequestMapping("/wishlist")
public class WishlistRestController {
    @Autowired
    private IWishlistService wishlistService;

    @Operation(description = "Ajouter un produit à la wishlist")
    @PostMapping("/add/{userId}/{productId}")
    public ResponseEntity<Wishlist> addToWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
            Wishlist wishlist = wishlistService.addToWishlist(userId, productId);
            return ResponseEntity.ok(wishlist);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(description = "Supprimer un produit de la wishlist")
    @DeleteMapping("/remove/{userId}/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
            wishlistService.removeFromWishlist(userId, productId);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(404).build(); // Entrée non trouvée
        } catch (Exception e) {
            return ResponseEntity.status(500).build(); // Erreur serveur
        }
    }

    @Operation(description = "Récupérer la wishlist d'un utilisateur")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlistByUserId(@PathVariable Long userId) {
        try {
            List<Wishlist> wishlist = wishlistService.getWishlistByUserId(userId);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @Operation(description = "Vérifier si un produit est dans la wishlist")
    @GetMapping("/check/{userId}/{productId}")
    public ResponseEntity<Boolean> isProductInWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
            boolean isInWishlist = wishlistService.isProductInWishlist(userId, productId);
            return ResponseEntity.ok(isInWishlist);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }
}