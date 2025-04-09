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

@RestController
@RequestMapping("/users")
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
}

