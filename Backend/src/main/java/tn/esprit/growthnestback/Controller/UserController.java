package tn.esprit.growthnestback.Controller;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Services.UserService;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "User Management")
public class UserController {
    private final UserService userService;
    private static final String UPLOAD_DIR = "uploads/";

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            byte[] bytes = file.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(bytes);
            return ResponseEntity.ok(base64Image); // Return the base64 string
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file");
        }
    }

    @PatchMapping("/{userId}/lock")
    public ResponseEntity<?> toggleLockState(@PathVariable Long userId) {
        User user = userService.toggleLockState(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean sent = userService.sendResetPasswordLink(email);

        if (sent) {
            return ResponseEntity.ok(Map.of("message", "Password reset link sent to email."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found."));
        }
    }

    @GetMapping("/reset-password")
    public ResponseEntity<String> validateResetToken(@RequestParam("token") String token) {
        boolean isValid = userService.isResetTokenValid(token);

        if (isValid) {
            return ResponseEntity.ok("Token is valid");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }
    }


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        System.out.println("Received token: " + token);

        boolean passwordReset = userService.resetPassword(token, newPassword);

        if (passwordReset) {
            return ResponseEntity.ok("Password has been reset.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
        }
    }

}









