package tn.esprit.growthnestback.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.growthnestback.Entities.Products;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Entities.Wishlist;
import tn.esprit.growthnestback.Repository.ProductsRepository;
import tn.esprit.growthnestback.Repository.UserRepository;
import tn.esprit.growthnestback.Repository.WishlistRepository;

import java.util.List;

@Service
public class WishlistServiceImpl implements IWishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductsRepository productsRepository;

    @Override
    @Transactional
    public Wishlist addToWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Products product = productsRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

        if (wishlistRepository.findByUserIdAndProductIdProduct(userId, productId).isPresent()) {
            throw new IllegalStateException("Product already in wishlist");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        return wishlistRepository.save(wishlist);
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        if (!wishlistRepository.findByUserIdAndProductIdProduct(userId, productId).isPresent()) {
            throw new IllegalStateException("Wishlist entry not found for userId: " + userId + ", productId: " + productId);
        }
        wishlistRepository.deleteByUserIdAndProductIdProduct(userId, productId);
    }

    @Override
    public List<Wishlist> getWishlistByUserId(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    @Override
    public boolean isProductInWishlist(Long userId, Long productId) {
        return wishlistRepository.findByUserIdAndProductIdProduct(userId, productId).isPresent();
    }
}