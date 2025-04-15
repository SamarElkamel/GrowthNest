package tn.esprit.growthnestback.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.Services.IBusinessService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Validated
@AllArgsConstructor
@RestController
@Tag(name = "gestion des business")
@RequestMapping("/business")
public class BusinessRestController {

    private final IBusinessService iBusinessService;
    private static final String UPLOAD_DIR = "uploads/logos/";

    @Operation(description = "uploader un logo")
    @PostMapping(value = "/upload-logo", consumes = {"image/jpeg", "image/png"})
    public ResponseEntity<String> uploadLogo(@RequestBody byte[] imageBytes) throws IOException {
        // Validate image size
        if (imageBytes.length > 5 * 1024 * 1024) { // 5MB limit
            throw new IllegalArgumentException("Image size exceeds 5MB");
        }
        // Generate unique file name
        String fileName = UUID.randomUUID().toString() + getFileExtension(imageBytes);
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, imageBytes);
        // Return the file path
        return ResponseEntity.ok("/uploads/logos/" + fileName);
    }

    @Operation(description = "ajouter un business")
    @PostMapping("/addBusiness")
    public Business addBusiness(@RequestBody Business business) {
        return iBusinessService.addBusiness(business);
    }

    @Operation(description = "afficher tous les business")
    @GetMapping("/getAllBusiness")
    public List<Business> getAllBusiness() {
        return iBusinessService.getAllBusiness();
    }

    @Operation(description = "afficher un business selon l'id")
    @GetMapping("/getBusinessById/{idB}")
    public Business getBusinessById(@PathVariable("idB") Long id) {
        return iBusinessService.getBusinessById(id);
    }

    @Operation(description = "modifier un business")
    @PutMapping("/updateBusiness")
    public Business updateBusiness(@RequestBody Business business) {
        return iBusinessService.updateBusiness(business);
    }

    @Operation(description = "supprimer un business")
    @DeleteMapping("/deleteBusiness/{idB}")
    public void deleteBusiness(@PathVariable("idB") Long idB) {
        iBusinessService.deleteBusiness(idB);
    }

    @Operation(description = "noter un business")
    @PostMapping("/{businessId}/rate")
    public void rateBusiness(@PathVariable Long businessId, @RequestBody Integer ratingValue) {
        iBusinessService.addRating(businessId, ratingValue);
    }

    @Operation(description = "obtenir la note d'un utilisateur pour un business")
    @GetMapping("/{businessId}/user-rating")
    public Integer getUserRating(@PathVariable Long businessId) {
        return iBusinessService.getUserRating(businessId);
    }

    // Helper method to determine file extension
    private String getFileExtension(byte[] imageBytes) {
        // Basic detection; improve with a library like Tika if needed
        if (imageBytes.length > 2 && imageBytes[0] == (byte) 0xFF && imageBytes[1] == (byte) 0xD8) {
            return ".jpg";
        }
        return ".png"; // Fallback
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handleIOException(IOException ex) {
        return ResponseEntity.badRequest().body("Failed to upload logo: " + ex.getMessage());
    }
    @GetMapping(value = "/{id}/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] generateQRCodeForBusiness(
            @PathVariable("id") Long businessId,
            @RequestParam(value = "width", defaultValue = "200") int width,
            @RequestParam(value = "height", defaultValue = "200") int height) throws Exception {
        return iBusinessService.generateQRCodeForBusiness(businessId, width, height);
    }
}