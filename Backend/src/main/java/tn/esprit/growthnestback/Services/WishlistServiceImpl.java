package tn.esprit.growthnestback.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.growthnestback.Entities.Products;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Entities.Wishlist;
import tn.esprit.growthnestback.dto.WishlistDTO;
import tn.esprit.growthnestback.Repository.ProductsRepository;
import tn.esprit.growthnestback.Repository.UserRepository;
import tn.esprit.growthnestback.Repository.WishlistRepository;

import java.util.List;
import java.util.stream.Collectors;

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
        if (userId == null || productId == null) {
            throw new IllegalArgumentException("User ID and Product ID cannot be null");
        }
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
        if (userId == null || productId == null) {
            throw new IllegalArgumentException("User ID and Product ID cannot be null");
        }
        if (!wishlistRepository.findByUserIdAndProductIdProduct(userId, productId).isPresent()) {
            throw new IllegalStateException("Wishlist entry not found for userId: " + userId + ", productId: " + productId);
        }
        wishlistRepository.deleteByUserIdAndProductIdProduct(userId, productId);
    }

    @Override
    public List<WishlistDTO> getWishlistByUserId(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        List<Wishlist> wishlists = wishlistRepository.findByUserIdWithProduct(userId);
        return wishlists.stream()
                .map(wishlist -> {
                    WishlistDTO dto = new WishlistDTO();
                    dto.setId(wishlist.getId());
                    dto.setUserId(wishlist.getUser().getId());
                    dto.setProductId(wishlist.getProduct().getIdProduct());
                    dto.setProductName(wishlist.getProduct().getName());
                    dto.setProductDescription(wishlist.getProduct().getDescription());
                    dto.setProductPrice(wishlist.getProduct().getPrice());
                    dto.setProductImage(wishlist.getProduct().getImage());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public boolean isProductInWishlist(Long userId, Long productId) {
        if (userId == null || productId == null) {
            throw new IllegalArgumentException("User ID and Product ID cannot be null");
        }
        return wishlistRepository.findByUserIdAndProductIdProduct(userId, productId).isPresent();
    }
}