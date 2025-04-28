package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Products;
import tn.esprit.growthnestback.Entities.StockMovement;

import java.util.List;
import java.util.Map;

public interface IProductsService {
    public List<Products> GetAllProducts();
    public Products GetProductById(Long id);
    public Products AddProduct(Products product);
    public Products UpdateProduct(Products product);
    public void DeleteProduct(Long id);
    public List<Products> getProductsByBusinessId(Long businessId);
    public Products createProduct(Long businessId, Products product);
    Products updateStock(Long productId, Long quantity, StockMovement.MovementType movementType);
    List<StockMovement> getStockMovements(Long productId);
    Map<String, Long> getStockRotationStats(Long businessId);
}
