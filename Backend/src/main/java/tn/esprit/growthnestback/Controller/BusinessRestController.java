package tn.esprit.growthnestback.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.Services.IBusinessService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;


@AllArgsConstructor
@RestController
@Tag(name = "gestion des business")
@RequestMapping("/business")
public class BusinessRestController {

    private final IBusinessService iBusinessService;
    private static final String UPLOAD_DIR = "Uploads/logos/";

    @Operation(description = "uploader un logo")
    @PostMapping(value = "/upload-logo", consumes = {"image/jpeg", "image/png"})
    public String uploadLogo(@RequestBody byte[] imageBytes) throws IOException {
        System.out.println("Uploading logo, size: " + imageBytes.length);
        if (imageBytes.length > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Image size exceeds 5MB");
        }
        String fileName = UUID.randomUUID().toString() + getFileExtension(imageBytes);
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, imageBytes);
        System.out.println("Logo uploaded: /Uploads/logos/" + fileName);
        return "/Uploads/logos/" + fileName;
    }

    @Operation(description = "ajouter un business")
    @PostMapping("/addBusiness")
    public Business addBusiness(@RequestBody Business business) {
        System.out.println("Adding business: " + business.getName());
        Business savedBusiness = iBusinessService.addBusiness(business);
        System.out.println("Business added: ID " + savedBusiness.getIdBusiness());
        return savedBusiness;
    }

    @Operation(description = "afficher tous les business")
    @GetMapping("/getAllBusiness")
    public List<Business> getAllBusiness() {
        System.out.println("Fetching all businesses");
        return iBusinessService.getAllBusiness();
    }

    @Operation(description = "afficher un business selon l'id")
    @GetMapping("/getBusinessById/{idB}")
    public Business getBusinessById(@PathVariable("idB") Long id) {
        System.out.println("Fetching business ID: " + id);
        Business business = iBusinessService.getBusinessById(id);
        if (business == null) {
            throw new IllegalArgumentException("Business not found with ID: " + id);
        }
        return business;
    }

    @Operation(description = "modifier un business")
    @PutMapping("/updateBusiness")
    public Business updateBusiness(@RequestBody Business business) {
        System.out.println("Updating business ID: " + business.getIdBusiness());
        Business updatedBusiness = iBusinessService.updateBusiness(business);
        System.out.println("Business updated: ID " + updatedBusiness.getIdBusiness());
        return updatedBusiness;
    }

    @Operation(description = "supprimer un business")
    @DeleteMapping("/deleteBusiness/{idB}")
    public void deleteBusiness(@PathVariable("idB") Long idB) {
        System.out.println("Deleting business ID: " + idB);
        iBusinessService.deleteBusiness(idB);
        System.out.println("Business deleted: ID " + idB);
    }

    @Operation(description = "noter un business")
    @PostMapping("/{businessId}/rate")
    public void rateBusiness(
            @PathVariable Long businessId,
            @RequestBody @Min(1) @Max(5) Integer ratingValue) {
        System.out.println("Rating business ID: " + businessId + ", value: " + ratingValue);
        try {
            iBusinessService.addRating(businessId, ratingValue);
            System.out.println("Rating submitted for business ID: " + businessId);
        } catch (Exception e) {
            System.out.println("Error rating business ID " + businessId + ": " + e.getMessage());
            throw new RuntimeException("Failed to rate business: " + e.getMessage());
        }
    }

    @Operation(description = "obtenir la note d'un utilisateur pour un business")
    @GetMapping("/{businessId}/user-rating")
    public Integer getUserRating(@PathVariable Long businessId) {
        System.out.println("Fetching user rating for business ID: " + businessId);
        try {
            Integer rating = iBusinessService.getUserRating(businessId);
            System.out.println("User rating for business ID " + businessId + ": " + rating);
            return rating;
        } catch (Exception e) {
            System.out.println("Error fetching rating for business ID " + businessId + ": " + e.getMessage());
            throw new RuntimeException("Failed to fetch rating: " + e.getMessage());
        }
    }

    @Operation(description = "générer un QR code pour un business")
    @GetMapping(value = "/{id}/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] generateQRCodeForBusiness(
            @PathVariable("id") Long businessId,
            @RequestParam(value = "width", defaultValue = "200") int width,
            @RequestParam(value = "height", defaultValue = "200") int height) throws Exception {
        System.out.println("Generating QR code for business ID: " + businessId);
        try {
            byte[] qrCode = iBusinessService.generateQRCodeForBusiness(businessId, width, height);
            System.out.println("QR code generated for business ID: " + businessId);
            return qrCode;
        } catch (Exception e) {
            System.out.println("Error generating QR code for business ID " + businessId + ": " + e.getMessage());
            throw new RuntimeException("Failed to generate QR code: " + e.getMessage());
        }
    }

    private String getFileExtension(byte[] imageBytes) {
        if (imageBytes.length > 2 && imageBytes[0] == (byte) 0xFF && imageBytes[1] == (byte) 0xD8) {
            return ".jpg";
        }
        return ".png";
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public String handleIllegalArgument(IllegalArgumentException ex) {
        System.out.println("IllegalArgumentException: " + ex.getMessage());
        return ex.getMessage();
    }

    @ExceptionHandler(IOException.class)
    public String handleIOException(IOException ex) {
        System.out.println("IOException: " + ex.getMessage());
        return "Failed to upload logo: " + ex.getMessage();
    }

    @ExceptionHandler(RuntimeException.class)
    public String handleRuntimeException(RuntimeException ex) {
        System.out.println("RuntimeException: " + ex.getMessage());
        return ex.getMessage();
    }
}