package tn.esprit.growthnestback.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.growthnestback.Entities.ErrorResponse;
import tn.esprit.growthnestback.dto.ProductDTO;
import tn.esprit.growthnestback.Entities.Products;
import tn.esprit.growthnestback.Entities.StockMovement;
import tn.esprit.growthnestback.Services.IProductsService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Validated
@AllArgsConstructor
@RestController
@Tag(name = "gestion des produits")
@RequestMapping("/Products")
public class ProductsRestController {
    private static final Logger logger = LoggerFactory.getLogger(ProductsRestController.class);

    @Autowired
    IProductsService iProductsService;

    private static final String UPLOAD_DIR = "uploads/";
    private static final String PRODUCT_IMAGES_DIR = UPLOAD_DIR + "products/";

    @Operation(description = "Uploader une image de produit")
    @PostMapping(value = "/upload-product-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String uploadProductImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("Fichier vide");

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadDir = Paths.get(PRODUCT_IMAGES_DIR).toAbsolutePath().normalize();
        Path path = uploadDir.resolve(fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());
        logger.info("Image saved to: {}", path.toAbsolutePath());
        return fileName;
    }

    @Operation(description = "Créer un produit avec image")
    @PostMapping(value = "/business/{businessId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> AddBusinessProduct(
            @PathVariable("businessId") Long businessId,
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Products product = mapper.readValue(productJson, Products.class);

            if (image != null && !image.isEmpty()) {
                String imageUrl = this.uploadProductImage(image);
                product.setImage(imageUrl);
            }

            Products createdProduct = iProductsService.createProduct(businessId, product);
            return ResponseEntity.ok(createdProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create product: " + e.getMessage()));
        }
    }

    @Operation(description = "Afficher tous les produits")
    @GetMapping("/getAllProducts")
    public ResponseEntity<List<ProductDTO>> GetAllProducts() {
        List<Products> products = iProductsService.GetAllProducts();
        List<ProductDTO> productDTOs = products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productDTOs);
    }

    @Operation(description = "Afficher un produit selon l'id")
    @GetMapping("/getProductById/{idP}")
    public ResponseEntity<ProductDTO> GetProductById(@PathVariable("idP") Long id) {
        Products product = iProductsService.GetProductById(id);
        return ResponseEntity.ok(mapToDTO(product));
    }

    @Operation(description = "Ajouter un produit")
    @PostMapping("/addProduct")
    public ResponseEntity<ProductDTO> AddProducts(@RequestBody @Valid Products products) {
        Products savedProduct = iProductsService.AddProduct(products);
        return ResponseEntity.ok(mapToDTO(savedProduct));
    }

    @Operation(description = "Modifier un produit")
    @PutMapping("/updateProduct")
    public ResponseEntity<ProductDTO> UpdateProducts(@RequestBody Products products) {
        Products updatedProduct = iProductsService.UpdateProduct(products);
        return ResponseEntity.ok(mapToDTO(updatedProduct));
    }

    @Operation(description = "Supprimer un produit")
    @DeleteMapping("/deleteProduct/{idP}")
    public ResponseEntity<Void> deleteProductById(@PathVariable("idP") Long id) {
        iProductsService.DeleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @Operation(description = "Obtenir tous les produits d’un small business")
    @GetMapping("/getProductBusiness/{businessId}")
    public ResponseEntity<List<ProductDTO>> getProductsByBusiness(@PathVariable Long businessId) {
        try {
            List<ProductDTO> products = iProductsService.getProductsByBusinessId(businessId);
            return ResponseEntity.ok(products);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(List.of(new ProductDTO())); // Return empty DTO list or handle differently
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of(new ProductDTO())); // Return empty DTO list or handle differently
        }
    }

    @Operation(description = "Uploader un logo")
    @PostMapping(value = "/upload-logo", consumes = {"image/jpeg", "image/png"})
    public String uploadLogo(@RequestBody byte[] imageBytes) throws IOException {
        logger.info("Uploading logo, size: {}", imageBytes.length);
        if (imageBytes.length > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Image size exceeds 5MB");
        }
        String fileName = UUID.randomUUID().toString() + getFileExtension(imageBytes);
        Path filePath = Paths.get(PRODUCT_IMAGES_DIR + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, imageBytes);
        logger.info("Logo uploaded: /uploads/products/{}", fileName);
        return "/uploads/products/" + fileName;
    }

    private String getFileExtension(byte[] imageBytes) {
        if (imageBytes.length > 2 && imageBytes[0] == (byte) 0xFF && imageBytes[1] == (byte) 0xD8) {
            return ".jpg";
        }
        return ".png";
    }

    @Operation(description = "Obtenir l'image du code-barres d’un produit")
    @GetMapping(value = "/barcode/{idP}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<FileSystemResource> getBarcodeImage(@PathVariable("idP") Long id) {
        Products product = iProductsService.GetProductById(id);
        if (product.getBarcodePath() == null) {
            throw new RuntimeException("Barcode not found for product with id: " + id);
        }
        FileSystemResource file = new FileSystemResource(product.getBarcodePath());
        if (!file.exists()) {
            throw new RuntimeException("Barcode file not found: " + product.getBarcodePath());
        }
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(file);
    }

    @Operation(description = "Ajouter du stock")
    @PutMapping("/stock/add/{productId}/{quantity}")
    public ResponseEntity<ProductDTO> addStock(@PathVariable Long productId, @PathVariable Long quantity) {
        try {
            Products updatedProduct = iProductsService.updateStock(productId, quantity, StockMovement.MovementType.ADD);
            return ResponseEntity.ok(mapToDTO(updatedProduct));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(description = "Réduire le stock")
    @PutMapping("/stock/reduce/{productId}/{quantity}")
    public ResponseEntity<ProductDTO> reduceStock(@PathVariable Long productId, @PathVariable Long quantity) {
        try {
            Products updatedProduct = iProductsService.updateStock(productId, quantity, StockMovement.MovementType.REDUCE);
            return ResponseEntity.ok(mapToDTO(updatedProduct));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(description = "Obtenir l'historique des mouvements de stock")
    @GetMapping("/stock/movements/{productId}")
    public List<StockMovement> getStockMovements(@PathVariable Long productId) {
        return iProductsService.getStockMovements(productId);
    }

    @Operation(description = "Obtenir les statistiques de rotation de stock")
    @GetMapping("/stock/rotation/{businessId}")
    public Map<String, Long> getStockRotationStats(@PathVariable Long businessId) {
        return iProductsService.getStockRotationStats(businessId);
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
}