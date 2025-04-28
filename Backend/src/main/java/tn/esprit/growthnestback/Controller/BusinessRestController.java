package tn.esprit.growthnestback.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.Entities.BusinessStatisticsDTO;
import tn.esprit.growthnestback.Services.IBusinessService;
import tn.esprit.growthnestback.Services.TaskService;
import tn.esprit.growthnestback.Services.UserService;
import tn.esprit.growthnestback.Entities.Task;
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
    @Autowired
    private final IBusinessService iBusinessService;
    @Autowired
    private final TaskService taskService;

    @Autowired
    private final UserService userService;
    @Autowired
    private final SimpMessagingTemplate messagingTemplate;
    private static final String UPLOAD_DIR = "uploads/";
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
        logger.info("Logo uploaded: /uploads/logos/{}", fileName);
        return "/uploads/logos/" + fileName;
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
        if (pdfFileName.startsWith("/uploads/pdfs/")) {
            pdfFileName = pdfFileName.substring("/uploads/pdfs/".length());
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

    @Operation(description = "Ajouter un business avec logo et PDF optionnels")
    @PostMapping(value = "/addBusiness", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addBusiness(
            @Parameter(description = "JSON string containing business details (name required, others optional)")
            @RequestPart(value = "business", required = true) String businessJson,
            @Parameter(description = "Logo image file (JPEG/PNG, max 5MB, optional)")
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @Parameter(description = "PDF document (max 10MB, optional)")
            @RequestPart(value = "pdf", required = false) MultipartFile pdf) {
        try {
            logger.info("Received request to add business");
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

            // Validate business
            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<Business>> violations = validator.validate(business);
            if (!violations.isEmpty()) {
                logger.error("Validation errors: {}", violations);
                return ResponseEntity.badRequest().body("Validation errors: " + violations);
            }
            if (business.getName() == null || business.getName().trim().isEmpty()) {
                logger.error("Business name is required");
                return ResponseEntity.badRequest().body("Business name is required");
            }

            // Set the current user as the business owner
            Long currentUserId = UserService.currentUserId();
            business.setUser(userService.findById(currentUserId)
                    .orElseThrow(() -> new IllegalArgumentException("Current user not found with ID: " + currentUserId)));

            // Handle logo upload
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
                business.setLogo("/uploads/logos/" + fileName);
                logger.info("Logo uploaded: /uploads/logos/{}", fileName);
            }

            // Handle PDF upload
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
                business.setBusinessPdf(pdfName);
                logger.info("PDF uploaded: {}", pdfName);
            }

            Business savedBusiness = iBusinessService.addBusiness(business);
            logger.info("Business added: ID {}, Status: {}", savedBusiness.getIdBusiness(), savedBusiness.getStatus());

            // Notify admin
            Map<String, Object> notification = new HashMap<>();
            notification.put("businessId", savedBusiness.getIdBusiness());
            notification.put("businessName", savedBusiness.getName());
            notification.put("message", "New business pending approval: " + savedBusiness.getName());
            notification.put("userId", savedBusiness.getUser().getId());
            messagingTemplate.convertAndSend("/topic/admin-notifications", notification);
            logger.info("Notification sent to admin for business ID: {}", savedBusiness.getIdBusiness());

            return ResponseEntity.ok(savedBusiness);
        } catch (IOException e) {
            logger.error("IO error: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to process files: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error: " + e.getMessage());
        }
    }

    @Operation(description = "Approuver un business")
    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveBusiness(
            @Parameter(description = "ID of the business to approve")
            @PathVariable("id") Long id) {
        try {
            logger.info("Approving business ID: {}", id);
            Business business = iBusinessService.getBusinessById(id);
            if (business == null) {
                logger.error("Business not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Business not found with ID: " + id);
            }
            if (business.getStatus() != Business.BusinessStatus.PENDING) {
                logger.error("Business ID {} is not in PENDING status: {}", id, business.getStatus());
                return ResponseEntity.badRequest().body("Business is not in PENDING status");
            }
            business.setStatus(Business.BusinessStatus.APPROVED);
            Business updatedBusiness = iBusinessService.updateBusiness(business);
            logger.info("Business approved: ID {}, Status: {}", id, updatedBusiness.getStatus());

            // Notify owner
            Map<String, Object> notification = new HashMap<>();
            notification.put("businessId", id);
            notification.put("businessName", business.getName());
            notification.put("message", "Your business '" + business.getName() + "' has been approved!");
            messagingTemplate.convertAndSend("/topic/owner-notifications-" + business.getUser().getId(), notification);
            logger.info("Notification sent to user {} for approved business ID: {}", business.getUser().getId(), id);

            return ResponseEntity.ok(updatedBusiness);
        } catch (Exception e) {
            logger.error("Error approving business ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error approving business: " + e.getMessage());
        }
    }

    @Operation(description = "Rejeter un business")
    @PostMapping("/reject/{id}")
    public ResponseEntity<?> rejectBusiness(
            @Parameter(description = "ID of the business to reject")
            @PathVariable("id") Long id) {
        try {
            logger.info("Rejecting business ID: {}", id);
            Business business = iBusinessService.getBusinessById(id);
            if (business == null) {
                logger.error("Business not found with ID: {}", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Business not found with ID: " + id);
            }
            if (business.getStatus() != Business.BusinessStatus.PENDING) {
                logger.error("Business ID {} is not in PENDING status: {}", id, business.getStatus());
                return ResponseEntity.badRequest().body("Business is not in PENDING status");
            }
            business.setStatus(Business.BusinessStatus.REJECTED);
            Business updatedBusiness = iBusinessService.updateBusiness(business);
            logger.info("Business rejected: ID {}, Status: {}", id, updatedBusiness.getStatus());

            // Notify owner
            Map<String, Object> notification = new HashMap<>();
            notification.put("businessId", id);
            notification.put("businessName", business.getName());
            notification.put("message", "Your business '" + business.getName() + "' has been rejected.");
            messagingTemplate.convertAndSend("/topic/owner-notifications-" + business.getUser().getId(), notification);
            logger.info("Notification sent to user {} for rejected business ID: {}", business.getUser().getId(), id);

            return ResponseEntity.ok(updatedBusiness);
        } catch (Exception e) {
            logger.error("Error rejecting business ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error rejecting business: " + e.getMessage());
        }
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

    private String getFileExtension(byte[] imageBytes) {
        if (imageBytes.length > 2 && imageBytes[0] == (byte) 0xFF && imageBytes[1] == (byte) 0xD8) {
            return ".jpg";
        }
        return ".png";
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

    @Operation(description = "Modifier un business avec fichiers")
    @PutMapping(value = "/updateBusinessWithFiles", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBusinessWithFiles(
            @RequestPart("business") String businessJson,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @RequestPart(value = "pdf", required = false) MultipartFile pdf) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Business businessUpdates = objectMapper.readValue(businessJson, Business.class);
            Business existingBusiness = iBusinessService.getBusinessById(businessUpdates.getIdBusiness());

            if (existingBusiness == null) {
                return ResponseEntity.notFound().build();
            }

            // Valider que le status n'est pas modifié
            if (businessUpdates.getStatus() != null
                    && !businessUpdates.getStatus().equals(existingBusiness.getStatus())) {
                return ResponseEntity.badRequest().body("Le statut ne peut pas être modifié via cette opération");
            }

            // Copier uniquement les champs modifiables
            existingBusiness.setName(businessUpdates.getName());
            existingBusiness.setDescription(businessUpdates.getDescription());
            existingBusiness.setCategorieBusiness(businessUpdates.getCategorieBusiness());
            existingBusiness.setInstagramPageName(businessUpdates.getInstagramPageName());

            // Gestion logo
            if (logo != null && !logo.isEmpty()) {
                String fileName = handleFileUpload(logo, LOGO_DIR);
                existingBusiness.setLogo("/Uploads/logos/" + fileName);
                deleteOldFile(businessUpdates.getLogo(), LOGO_DIR);
            }

            // Gestion PDF
            if (pdf != null && !pdf.isEmpty()) {
                String pdfName = handleFileUpload(pdf, PDF_DIR);
                existingBusiness.setBusinessPdf(pdfName);
                deleteOldFile(businessUpdates.getBusinessPdf(), PDF_DIR);
            }

            // Conserver les valeurs non modifiables
            existingBusiness.setStatus(existingBusiness.getStatus());
            existingBusiness.setAverageRating(existingBusiness.getAverageRating());
            existingBusiness.setRatingCount(existingBusiness.getRatingCount());

            Business updatedBusiness = iBusinessService.updateBusiness(existingBusiness);
            return ResponseEntity.ok(updatedBusiness);
        } catch (Exception e) {
            logger.error("Update error: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error updating business: " + e.getMessage());
        }
    }

    private String handleFileUpload(MultipartFile file, String directory) throws IOException {
        String fileName = UUID.randomUUID().toString() + getFileExtension(file);
        Path filePath = Paths.get(System.getProperty("user.dir"), directory, fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());
        return fileName;
    }

    private void deleteOldFile(String filePath, String directory) {
        try {
            if (filePath != null && !filePath.isEmpty()) {
                String fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
                Path path = Paths.get(System.getProperty("user.dir"), directory, fileName);
                Files.deleteIfExists(path);
            }
        } catch (IOException e) {
            logger.warn("Error deleting old file: {}", e.getMessage());
        }
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

    @Operation(description = "afficher les trois meilleures entreprises par note moyenne")
    @GetMapping("/getTopThreeBusinesses")
    public List<Business> getTopThreeBusinesses() {
        logger.info("Fetching top three businesses by average rating");
        return iBusinessService.getTopThreeBusinessesByRating();
    }
    @Operation(description = "Ajouter une tâche à un business")
    @PostMapping("/{businessId}/tasks")
    public ResponseEntity<Task> addTask(
            @PathVariable Long businessId,
            @RequestBody Task task) {
        try {
            Task savedTask = taskService.addTask(businessId, task);
            return new ResponseEntity<>(savedTask, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Error adding task for business ID {}: {}", businessId, e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(description = "Récupérer les tâches d'un business")
    @GetMapping("/{businessId}/tasks")
    public ResponseEntity<List<Task>> getTasksByBusiness(@PathVariable Long businessId) {
        try {
            List<Task> tasks = taskService.getTasksByBusiness(businessId);
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Error fetching tasks for business ID {}: {}", businessId, e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(description = "Mettre à jour une tâche")
    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long taskId,
            @RequestBody Task task) {
        try {
            Task updatedTask = taskService.updateTask(taskId, task);
            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Error updating task ID {}: {}", taskId, e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(description = "Supprimer une tâche")
    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        try {
            taskService.deleteTask(taskId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Error deleting task ID {}: {}", taskId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(description = "Réorganiser les tâches")
    @PostMapping("/{businessId}/tasks/reorder")
    public ResponseEntity<Void> reorderTasks(
            @PathVariable Long businessId,
            @RequestBody List<Task> tasks) {
        try {
            taskService.reorderTasks(businessId, tasks);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Error reordering tasks for business ID {}: {}", businessId, e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/statistics")
    public ResponseEntity<BusinessStatisticsDTO> getBusinessStatistics() {
        BusinessStatisticsDTO stats =iBusinessService.getBusinessStatistics();
        return ResponseEntity.ok(stats);
    }
    @Operation(description = "Récupérer les businesses de l'utilisateur connecté")
    @GetMapping("/my-businesses")
    public ResponseEntity<List<Business>> getMyBusinesses() {
        Long currentUserId = UserService.currentUserId();
        logger.info("Fetching businesses for user ID: {}", currentUserId);
        List<Business> businesses = iBusinessService.getBusinessesByUser(currentUserId);
        if (businesses.isEmpty()) {
            logger.info("No businesses found for user ID: {}", currentUserId);
        }
        return ResponseEntity.ok(businesses);
    }
}