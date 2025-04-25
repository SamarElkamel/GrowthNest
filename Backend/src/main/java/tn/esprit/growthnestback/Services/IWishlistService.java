package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Wishlist;

import java.util.List;

public interface IWishlistService {
    Wishlist addToWishlist(Long userId, Long productId);
    void removeFromWishlist(Long userId, Long productId);
    List<Wishlist> getWishlistByUserId(Long userId);
    boolean isProductInWishlist(Long userId, Long productId);
}