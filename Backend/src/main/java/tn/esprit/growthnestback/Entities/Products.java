package tn.esprit.growthnestback.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long idProduct;
    @NotBlank(message = "Le nom du produit est obligatoire")
    @Size(min = 2, max = 30, message = "Le nom doit contenir entre 2 et 30 caractères")
    String name;
    @NotBlank(message = "La description est obligatoire")
    @Size(min = 10, max = 500, message = "La description doit contenir entre 10 et 500 caractères")
    String description;
    @Positive(message = "Le prix doit être strictement supérieur à 0")
    Float price;
    @NotNull(message = "Le stock est obligatoire")
    @Min(value = 0, message = "Le stock doit être supérieur ou égal à 0")    Long stock;

    String image;
     String barcodePath; // New field for barcode image

    @ManyToOne
    @JsonBackReference
    Business business;

    public String getBarcodePath() {
        return barcodePath;
    }

    public void setBarcodePath(String barcodePath) {
        this.barcodePath = barcodePath;
    }

    public Long getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(Long idProduct) {
        this.idProduct = idProduct;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Long getStock() {
        return stock;
    }

    public void setStock(Long stock) {
        this.stock = stock;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

}
