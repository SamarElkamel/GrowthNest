package tn.esprit.growthnestback.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.growthnestback.Entities.Products;
import tn.esprit.growthnestback.Services.IProductsService;

import java.util.List;
import java.util.UUID;

@Validated
@AllArgsConstructor
@RestController
@Tag(name="gestion des produits")
@RequestMapping("/Products")
public class ProductsRestController {
    private static final Logger logger = LoggerFactory.getLogger(BusinessRestController.class);

    @Autowired
    IProductsService iProductsService;
    // ProductsRestController.java
    private static final String UPLOAD_DIR = "uploads/";
    private static final String PRODUCT_IMAGES_DIR =UPLOAD_DIR + "products/";

    @Operation(description = "Uploader une image de produit")
    @PostMapping(value = "/upload-product-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String uploadProductImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("Fichier vide");

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadDir = Paths.get(PRODUCT_IMAGES_DIR).toAbsolutePath().normalize();
        Path path = uploadDir.resolve(fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());
        System.out.println("Image saved to: " + path.toAbsolutePath()); // Debug log
        return fileName; // Return only the filename
    }

    @Operation(description = "Créer un produit avec image")
    @PostMapping(value = "/business/{businessId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Products AddBusinessProduct(
            @PathVariable("businessId") Long businessId,
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Products product = mapper.readValue(productJson, Products.class);

        if (image != null && !image.isEmpty()) {
            String imageUrl = this.uploadProductImage(image);
            product.setImage(imageUrl);
        }

        return iProductsService.createProduct(businessId, product);
    }
    @Operation(description = "afficher tous les produits")
    @GetMapping("/getAllProducts")
    public List<Products> GetAllProducts() {
        return iProductsService.GetAllProducts();
    }
    @Operation(description = "afficher un produit selon l'id")
    @GetMapping("/getProductById/{idP}")
    public Products GetProductById(@PathVariable("idP") Long id) {
        return iProductsService.GetProductById(id);
    }
    @Operation(description = "ajouter un produit")
    @PostMapping("/addProduct")
    public Products AddProducts(@RequestBody @Valid Products products) {
        return iProductsService.AddProduct(products);
    }
    @Operation(description = "modifier un produit")
    @PutMapping("/updateProduct")
    public Products UpdateProducts(@RequestBody Products products) {
        return iProductsService.UpdateProduct(products);
    }
    @Operation(description = "supprimer un produit")
    @DeleteMapping("/deleteProduct/{idP}")
    public void deleteProductById(@PathVariable("idP") Long id) {
        iProductsService.DeleteProduct(id);
    }
   /* @PostMapping("/business/{businessId}")

     * 🔹 Créer un produit pour un small business

    public Products AddBusinessProduct(@PathVariable("businessId") Long businessId, @RequestBody Products products) {
        return iProductsService.createProduct(businessId, products);

    }
   @PostMapping("/business/{businessId}")
   /**
    * 🔹 Créer un produit pour un small business
    */
  /* public Products AddBusinessProduct(@PathVariable("businessId") Long businessId, @RequestBody Products products) {
       return iProductsService.createProduct(businessId, products);

   }

    /**
     * 🔹 Obtenir tous les produits d’un small business
     */
    @GetMapping("/getProductBusiness/{businessId}")
    public List<Products> getProductsByBusiness(@PathVariable Long businessId) {
        return iProductsService.getProductsByBusinessId(businessId);
    }
    @Operation(description = "uploader un logo")
    @PostMapping(value = "/upload-logo", consumes = {"image/jpeg", "image/png"})
    public String uploadLogo(@RequestBody byte[] imageBytes) throws IOException {
        logger.info("Uploading logo, size: {}", imageBytes.length);
        if (imageBytes.length > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Image size exceeds 5MB");
        }
        String fileName = UUID.randomUUID().toString() + getFileExtension(imageBytes);
        Path filePath = Paths.get( PRODUCT_IMAGES_DIR+ fileName);
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


}
