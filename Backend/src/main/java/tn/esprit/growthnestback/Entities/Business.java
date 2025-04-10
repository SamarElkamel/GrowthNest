package tn.esprit.growthnestback.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Set;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long idBusiness;
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 3, max = 50, message = "Le nom doit avoir entre 3 et 50 caractères")
    String name;
    @NotBlank(message = "La description est obligatoire")
    @Size(min = 10, max = 255, message = "La description doit avoir entre 10 et 255 caractères")
    String description;

    @NotNull(message = "La catégorie est obligatoire")
    @Enumerated(EnumType.STRING)
    CategorieBusiness categorieBusiness;
  // @NotBlank(message = "Le logo est obligatoire")
    String logo;

    @OneToMany(mappedBy = "business",cascade = CascadeType.ALL)
    @JsonManagedReference
    Set<Products> Products;

    public Long getIdBusiness() {
        return idBusiness;
    }

    public void setIdBusiness(Long idBusiness) {
        this.idBusiness = idBusiness;
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

    public CategorieBusiness getCategorieBusiness() {
        return categorieBusiness;
    }

    public void setCategorieBusiness(CategorieBusiness categorieBusiness) {
        this.categorieBusiness = categorieBusiness;
    }

    /*public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        logo = logo;
    }*/

    public Set<Products> getProducts() {
        return Products;
    }

    public void setProducts(Set<Products> products) {
        Products = products;
    }
}
