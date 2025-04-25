package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Products;

import java.util.List;

public interface IProductsService {
    public List<Products> GetAllProducts();
    public Products GetProductById(Long id);
    public Products AddProduct(Products product);
    public Products UpdateProduct(Products product);
    public void DeleteProduct(Long id);
    public List<Products> getProductsByBusinessId(Long businessId);
    public Products createProduct(Long businessId, Products product);
}
