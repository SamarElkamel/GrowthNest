package tn.esprit.growthnestback.Services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.dto.ProductDTO;
import tn.esprit.growthnestback.Entities.Products;
import tn.esprit.growthnestback.Entities.StockMovement;
import tn.esprit.growthnestback.Repository.BusinessRepository;
import tn.esprit.growthnestback.Repository.ProductsRepository;
import tn.esprit.growthnestback.Repository.StockMovementRepository;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductsServiceImpl implements IProductsService {
    @Autowired
    ProductsRepository productsRepository;
    @Autowired
    BusinessRepository businessRepository;
    @Autowired
    private BarcodeService barcodeService;
    @Autowired
    StockMovementRepository stockMovementRepository;

    @Override
    public List<Products> GetAllProducts() {
        return productsRepository.findAll();
    }

    @Override
    public Products GetProductById(Long id) {
        return productsRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Override
    public Products AddProduct(Products product) {
        return productsRepository.save(product);
    }

    @Override
    public Products UpdateProduct(Products product) {
        return productsRepository.save(product);
    }

    @Override
    public void DeleteProduct(Long id) {
        productsRepository.deleteById(id);
    }

    @Override
    public List<ProductDTO> getProductsByBusinessId(Long businessId) {
        if (businessId == null) {
            throw new IllegalArgumentException("Business ID cannot be null");
        }
        List<Products> products = productsRepository.findByBusiness_IdBusiness(businessId);
        return products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO mapToDTO(Products product) {
        ProductDTO dto = new ProductDTO();
        dto.setIdProduct(product.getIdProduct());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCostPrice(product.getCostPrice());
        dto.setStock(product.getStock());
        dto.setImage(product.getImage());
        dto.setBarcodePath(product.getBarcodePath());
        return dto;
    }

    @Override
    public Products createProduct(Long businessId, Products product) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + businessId));
        product.setBusiness(business);
        Products savedProduct = productsRepository.save(product);
        try {
            String barcodePath = barcodeService.generateBarcode(savedProduct.getIdProduct().toString());
            savedProduct.setBarcodePath(barcodePath);
            return productsRepository.save(savedProduct);
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate barcode for product: " + e.getMessage());
        }
    }

    @Transactional
    public Products updateStock(Long productId, Long quantity, StockMovement.MovementType movementType) {
        Products product = GetProductById(productId);
        Long newStock = movementType == StockMovement.MovementType.ADD
                ? product.getStock() + quantity
                : product.getStock() - quantity;
        if (newStock < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        product.setStock(newStock);
        Products updatedProduct = productsRepository.save(product);

        StockMovement movement = StockMovement.builder()
                .product(product)
                .quantity(quantity)
                .movementType(movementType)
                .timestamp(LocalDateTime.now())
                .build();
        stockMovementRepository.save(movement);

        return updatedProduct;
    }

    public List<StockMovement> getStockMovements(Long productId) {
        return stockMovementRepository.findByProductIdProduct(productId);
    }

    public Map<String, Long> getStockRotationStats(Long businessId) {
        List<Products> products = getProductsByBusinessId(businessId).stream()
                .map(dto -> productsRepository.findById(dto.getIdProduct()).orElse(null))
                .filter(p -> p != null)
                .collect(Collectors.toList());
        return products.stream()
                .collect(Collectors.toMap(
                        Products::getName,
                        product -> stockMovementRepository.findByProductIdProduct(product.getIdProduct())
                                .stream()
                                .filter(m -> m.getMovementType() == StockMovement.MovementType.REDUCE)
                                .mapToLong(StockMovement::getQuantity)
                                .sum()
                ));
    }
}