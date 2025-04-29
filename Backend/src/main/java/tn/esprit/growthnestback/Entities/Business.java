package tn.esprit.growthnestback.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(indexes = {
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_rating", columnList = "average_rating")
})
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
    @Size(min = 1, max = 30, message = "Le nom de la page Instagram doit avoir entre 1 et 30 caractères")
    @Column(name = "instagram_page_name")
    String instagramPageName;
    @NotNull(message = "La catégorie est obligatoire")
    @Enumerated(EnumType.STRING)
    CategorieBusiness categorieBusiness;
  // @NotBlank(message = "Le logo est obligatoire")
  @Column(name = "logo", length = 255) // Adjust length as needed
  private String logo;
    @Column(name = "average_rating", nullable = false)
    private Double averageRating = 0.0;

    @Column(name = "rating_count", nullable = false)
    private Integer ratingCount = 0;
    @Column(name = "business_pdf", length = 255) // Optional PDF path
    String businessPdf;
    @Column(nullable = false, columnDefinition = "VARCHAR(255) DEFAULT '1'")
    private String ownerId = "1";
    @Enumerated(EnumType.STRING)
    private BusinessStatus status;

    public enum BusinessStatus {
        PENDING, APPROVED, REJECTED
    }
    @Column(name = "low_stock_threshold", nullable = false)
    Integer lowStockThreshold = 5;


    @OneToMany(mappedBy = "business",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonIgnore
    Set<Products> Products;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // Nom de la colonne FK
    @JsonBackReference // Empêche la sérialisation JSON circulaire
    private User user; // Nom en minuscule

    public Business() {
        this.averageRating = 0.0;
        this.ratingCount = 0;
        this.status = BusinessStatus.PENDING;
        this.lowStockThreshold = 5;
    }
    @Override
    public String toString() {
        return "Business{" +
                "idBusiness=" + idBusiness +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", status=" + status +
                ", categorieBusiness=" + categorieBusiness +
                ", averageRating=" + averageRating +
                ", ratingCount=" + ratingCount +
                ", lowStockThreshold=" + lowStockThreshold +
                '}';
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getBusinessPdf() {
        return businessPdf;
    }

    public void setBusinessPdf(String businessPdf) {
        this.businessPdf = businessPdf;
    }

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

    public BusinessStatus getStatus() {
        return status;
    }

    public void setStatus(BusinessStatus status) {
        this.status = status;
    }

    public Set<Products> getProducts() {
        return Products;
    }
    @JsonIgnore
    public void setProducts(Set<Products> products) {
        Products = products;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
    }

    public String getInstagramPageName() {
        return instagramPageName;
    }

    public void setInstagramPageName(String instagramPageName) {
        this.instagramPageName = instagramPageName;
    }

    public Integer getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(Integer lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
