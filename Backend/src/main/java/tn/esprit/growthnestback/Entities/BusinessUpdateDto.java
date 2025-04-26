package tn.esprit.growthnestback.Entities;

import lombok.Data;

@Data
public class BusinessUpdateDto {
    private Long idBusiness;
    private String name;
    private String description;
    private CategorieBusiness categorieBusiness;
    private String instagramPageName;
    private String logo;
    private String businessPdf;
}
