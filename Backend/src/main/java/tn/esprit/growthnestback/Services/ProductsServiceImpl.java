package tn.esprit.growthnestback.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.Entities.Products;
import tn.esprit.growthnestback.Repository.BusinessRepository;
import tn.esprit.growthnestback.Repository.ProductsRepository;

import java.io.IOException;
import java.util.List;

@Service
public class ProductsServiceImpl implements IProductsService{
    @Autowired
    ProductsRepository productsRepository;
    @Autowired
    BusinessRepository businessRepository;
    @Autowired
    private BarcodeService barcodeService;

    @Override
    public List<Products> GetAllProducts() {
        return productsRepository.findAll();
    }

    @Override
    public Products GetProductById(Long id) {
        return productsRepository.findById(id).get();
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
    public List<Products> getProductsByBusinessId(Long businessId) {
        return productsRepository.findByBusiness_IdBusiness(businessId);
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



}
