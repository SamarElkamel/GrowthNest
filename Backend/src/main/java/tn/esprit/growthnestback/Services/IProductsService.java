package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Products;
import tn.esprit.growthnestback.Entities.StockMovement;
import tn.esprit.growthnestback.dto.ProductDTO;

import java.util.List;
import java.util.Map;

public interface IProductsService {
    List<Products> GetAllProducts();
    Products GetProductById(Long id);
    Products AddProduct(Products product);
    Products UpdateProduct(Products product);
    void DeleteProduct(Long id);
    List<ProductDTO> getProductsByBusinessId(Long businessId);
    Products createProduct(Long businessId, Products product);
    Products updateStock(Long productId, Long quantity, StockMovement.MovementType movementType);
    List<StockMovement> getStockMovements(Long productId);
    Map<String, Long> getStockRotationStats(Long businessId);
}
