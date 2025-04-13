package tn.esprit.growthnestback.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.growthnestback.Entities.Products;
import tn.esprit.growthnestback.Services.IProductsService;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Validated
@AllArgsConstructor
@RestController
@Tag(name="gestion des produits")
@RequestMapping("/Products")
public class ProductsRestController {
    @Autowired
    IProductsService iProductsService;
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

    }*/
   @PostMapping("/business/{businessId}")
   /**
    * 🔹 Créer un produit pour un small business
    */
   public Products AddBusinessProduct(@PathVariable("businessId") Long businessId, @RequestBody Products products) {
       return iProductsService.createProduct(businessId, products);

   }

    /**
     * 🔹 Obtenir tous les produits d’un small business
     */
    @GetMapping("/business/{businessId}")
    public List<Products> getProductsByBusiness(@PathVariable Long businessId) {
        return iProductsService.getProductsByBusinessId(businessId);
    }
}
