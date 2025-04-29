package tn.esprit.growthnestback.dto;

import java.math.BigDecimal;

public class ProductDTO {
    private Long idProduct;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal costPrice;
    private Long stock;
    private String image;
    private String barcodePath;

    // Getters and setters
    public Long getIdProduct() { return idProduct; }
    public void setIdProduct(Long idProduct) { this.idProduct = idProduct; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getCostPrice() { return costPrice; }
    public void setCostPrice(BigDecimal costPrice) { this.costPrice = costPrice; }
    public Long getStock() { return stock; }
    public void setStock(Long stock) { this.stock = stock; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getBarcodePath() { return barcodePath; }
    public void setBarcodePath(String barcodePath) { this.barcodePath = barcodePath; }
}