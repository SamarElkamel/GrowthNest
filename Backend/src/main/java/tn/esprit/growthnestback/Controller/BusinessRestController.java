package tn.esprit.growthnestback.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.Services.IBusinessService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@AllArgsConstructor
@RestController
@Tag(name = "gestion des business")
@RequestMapping("/business")
public class BusinessRestController {
    private static final Logger logger = LoggerFactory.getLogger(BusinessRestController.class);
    private final IBusinessService iBusinessService;
    private static final String UPLOAD_DIR = "Uploads/";
    private static final String LOGO_DIR = UPLOAD_DIR + "logos/";
    private static final String PDF_DIR = UPLOAD_DIR + "pdfs/";

    @Operation(description = "uploader un logo")
    @PostMapping(value = "/upload-logo", consumes = {"image/jpeg", "image/png"})
    public String uploadLogo(@RequestBody byte[] imageBytes) throws IOException {
        logger.info("Uploading logo, size: {}", imageBytes.length);
        if (imageBytes.length > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Image size exceeds 5MB");
        }
        String fileName = UUID.randomUUID().toString() + getFileExtension(imageBytes);
        Path filePath = Paths.get(LOGO_DIR + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, imageBytes);
        logger.info("Logo uploaded: /Uploads/logos/{}", fileName);
        return "/Uploads/logos/" + fileName;
    }

    @Operation(description = "ajouter un business avec logo et PDF optionnels")
    @PostMapping(value = "/addBusiness", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addBusiness(
            @RequestPart(value = "business", required = true) String businessJson,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @RequestPart(value = "pdf", required = false) MultipartFile pdf) {
        try {
            logger.info("Received request parts:");
            logger.info("Business part: {}", businessJson != null ? businessJson : "null");
            logger.info("Logo part: {}", logo != null ? logo.getOriginalFilename() + " (type: " + logo.getContentType() + ", size: " + logo.getSize() + ")" : "null");
            logger.info("PDF part: {}", pdf != null ? pdf.getOriginalFilename() + " (type: " + pdf.getContentType() + ", size: " + pdf.getSize() + ")" : "null");

            ObjectMapper objectMapper = new ObjectMapper();
            Business business;
            try {
                business = objectMapper.readValue(businessJson, Business.class);
            } catch (JsonProcessingException e) {
                logger.error("Invalid business JSON format: {}", e.getMessage());
                return ResponseEntity.badRequest().body("Invalid business JSON format: " + e.getMessage());
            }

            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<Business>> violations = validator.validate(business);
            if (!violations.isEmpty()) {
                logger.error("Validation errors: {}", violations);
                return ResponseEntity.badRequest().body("Validation errors: " + violations);
            }

            if (logo != null && !logo.isEmpty()) {
                String contentType = logo.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    logger.error("Invalid logo type: {}", contentType);
                    return ResponseEntity.badRequest().body("Logo must be an image (e.g., JPEG, PNG)");
                }
                if (logo.getSize() > 5 * 1024 * 1024) {
                    logger.error("Logo size exceeds 5MB: {}", logo.getSize());
                    return ResponseEntity.badRequest().body("Logo size exceeds 5MB");
                }
                String fileName = UUID.randomUUID().toString() + getFileExtension(logo);
                Path filePath = Paths.get(System.getProperty("user.dir"), LOGO_DIR, fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, logo.getBytes());
                // Store full relative path for logo
                business.setLogo("/Uploads/logos/" + fileName);
                logger.info("Logo uploaded: /Uploads/logos/{}", fileName);
            }
            if (pdf != null && !pdf.isEmpty()) {
                String contentType = pdf.getContentType();
                if (contentType == null || !contentType.equals("application/pdf")) {
                    logger.error("Invalid PDF type: {}", contentType);
                    return ResponseEntity.badRequest().body("File must be a PDF");
                }
                if (pdf.getSize() > 10 * 1024 * 1024) {
                    logger.error("PDF size exceeds 10MB: {}", pdf.getSize());
                    return ResponseEntity.badRequest().body("PDF size exceeds 10MB");
                }
                String pdfName = UUID.randomUUID().toString() + ".pdf";
                Path pdfPath = Paths.get(System.getProperty("user.dir"), PDF_DIR, pdfName);
                Files.createDirectories(pdfPath.getParent());
                Files.write(pdfPath, pdf.getBytes());
                // Store only filename for PDF
                business.setBusinessPdf(pdfName);
                logger.info("PDF uploaded: {}", pdfName);
            }

            Business savedBusiness = iBusinessService.addBusiness(business);
            logger.info("Business added: ID {}", savedBusiness.getIdBusiness());
            return ResponseEntity.ok(savedBusiness);
        } catch (IOException e) {
            logger.error("IO error: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to process files: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error: " + e.getMessage());
        }
    }

    @Operation(description = "télécharger le PDF d'un business")
    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> downloadBusinessPdf(@PathVariable("id") Long id) throws IOException {
        logger.info("Fetching PDF for business ID: {}", id);
        Business business = iBusinessService.getBusinessById(id);
        if (business == null) {
            logger.error("Business not found with ID: {}", id);
            throw new IllegalArgumentException("Business not found with ID: " + id);
        }
        if (business.getBusinessPdf() == null) {
            logger.error("No PDF available for business ID: {}", id);
            throw new IllegalArgumentException("No PDF available for business ID: " + id);
        }
        String baseDir = System.getProperty("user.dir") + "/" + UPLOAD_DIR + "pdfs/";
        String pdfFileName = business.getBusinessPdf();
        // Handle full path by stripping /Uploads/pdfs/ if present
        if (pdfFileName.startsWith("/Uploads/pdfs/")) {
            pdfFileName = pdfFileName.substring("/Uploads/pdfs/".length());
        }
        Path pdfPath = Paths.get(baseDir, pdfFileName);
        logger.info("Checking PDF path: {}", pdfPath.toAbsolutePath());
        if (!Files.exists(pdfPath)) {
            logger.error("PDF file not found at: {}", pdfPath.toAbsolutePath());
            throw new IllegalArgumentException("PDF file not found for business ID: " + id);
        }
        byte[] pdfBytes = Files.readAllBytes(pdfPath);
        logger.info("PDF retrieved for business ID: {}, size: {} bytes", id, pdfBytes.length);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename(pdfFileName).build());
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
    private String getFileExtension(MultipartFile file) {
        String contentType = file.getContentType();
        logger.info("File content type: {}", contentType);
        if (contentType == null) {
            throw new IllegalArgumentException("Unknown file type");
        }
        switch (contentType.toLowerCase()) {
            case "image/jpeg":
            case "image/jpg":
                return ".jpg";
            case "image/png":
                return ".png";
            case "application/pdf":
                return ".pdf";
            default:
                throw new IllegalArgumentException("Unsupported file type: " + contentType);
        }
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        logger.error("IllegalArgumentException: {}", ex.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        HttpStatus status = ex.getMessage().contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(error, status);
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<Map<String, String>> handleMissingServletRequestPart(MissingServletRequestPartException ex) {
        logger.error("Missing request part: {}", ex.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("error", "Missing required part: " + ex.getRequestPartName());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<Map<String, String>> handleIOException(IOException ex) {
        logger.error("IOException: {}", ex.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("error", "Failed to upload file: " + ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        logger.error("RuntimeException: {}", ex.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Operation(description = "afficher tous les business")
    @GetMapping("/getAllBusiness")
    public List<Business> getAllBusiness() {
        logger.info("Fetching all businesses");
        return iBusinessService.getAllBusiness();
    }

    @Operation(description = "afficher un business selon l'id")
    @GetMapping("/getBusinessById/{idB}")
    public Business getBusinessById(@PathVariable("idB") Long id) {
        logger.info("Fetching business ID: {}", id);
        Business business = iBusinessService.getBusinessById(id);
        if (business == null) {
            throw new IllegalArgumentException("Business not found with ID: " + id);
        }
        return business;
    }

    @Operation(description = "modifier un business")
    @PutMapping("/updateBusiness")
    public Business updateBusiness(@RequestBody Business business) {
        logger.info("Updating business ID: {}", business.getIdBusiness());
        Business updatedBusiness = iBusinessService.updateBusiness(business);
        logger.info("Business updated: ID {}", updatedBusiness.getIdBusiness());
        return updatedBusiness;
    }

    @Operation(description = "supprimer un business")
    @DeleteMapping("/deleteBusiness/{idB}")
    public void deleteBusiness(@PathVariable("idB") Long idB) {
        logger.info("Deleting business ID: {}", idB);
        iBusinessService.deleteBusiness(idB);
        logger.info("Business deleted: ID {}", idB);
    }

    @Operation(description = "noter un business")
    @PostMapping("/{businessId}/rate")
    public void rateBusiness(
            @PathVariable Long businessId,
            @RequestBody @Min(1) @Max(5) Integer ratingValue) {
        logger.info("Rating business ID: {}, value: {}", businessId, ratingValue);
        try {
            iBusinessService.addRating(businessId, ratingValue);
            logger.info("Rating submitted for business ID: {}", businessId);
        } catch (Exception e) {
            logger.error("Error rating business ID {}: {}", businessId, e.getMessage());
            throw new RuntimeException("Failed to rate business: " + e.getMessage());
        }
    }

    @Operation(description = "obtenir la note d'un utilisateur pour un business")
    @GetMapping("/{businessId}/user-rating")
    public Integer getUserRating(@PathVariable Long businessId) {
        logger.info("Fetching user rating for business ID: {}", businessId);
        try {
            Integer rating = iBusinessService.getUserRating(businessId);
            logger.info("User rating for business ID {}: {}", businessId, rating);
            return rating;
        } catch (Exception e) {
            logger.error("Error fetching rating for business ID {}: {}", businessId, e.getMessage());
            throw new RuntimeException("Failed to fetch rating: " + e.getMessage());
        }
    }

    @Operation(description = "générer un QR code pour un business")
    @GetMapping(value = "/{id}/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] generateQRCodeForBusiness(
            @PathVariable("id") Long businessId,
            @RequestParam(value = "width", defaultValue = "200") int width,
            @RequestParam(value = "height", defaultValue = "200") int height) throws Exception {
        logger.info("Generating QR code for business ID: {}", businessId);
        try {
            byte[] qrCode = iBusinessService.generateQRCodeForBusiness(businessId, width, height);
            logger.info("QR code generated for business ID: {}", businessId);
            return qrCode;
        } catch (Exception e) {
            logger.error("Error generating QR code for business ID {}: {}", businessId, e.getMessage());
            throw new RuntimeException("Failed to generate QR code: " + e.getMessage());
        }
    }

    private String getFileExtension(byte[] imageBytes) {
        if (imageBytes.length > 2 && imageBytes[0] == (byte) 0xFF && imageBytes[1] == (byte) 0xD8) {
            return ".jpg";
        }
        return ".png";
    }
}