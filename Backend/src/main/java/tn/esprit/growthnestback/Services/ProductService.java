package tn.esprit.growthnestback.Services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Products;
import tn.esprit.growthnestback.Repository.ProductsRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductsRepository productRepository;

    public List<Products> getAll() {
        return productRepository.findAll();
    }

    public Products getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    public Products create(Products product) {
        return productRepository.save(product);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}
