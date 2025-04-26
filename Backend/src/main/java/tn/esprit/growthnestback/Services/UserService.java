package tn.esprit.growthnestback.Services;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.ChangePasswordRequest;
import tn.esprit.growthnestback.Entities.EditProfileRequest;
import tn.esprit.growthnestback.Entities.EmailTemplateName;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository, EmailService emailService, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;

    }
    public static Long currentUserId() {
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        if (principal instanceof User user) {
            return user.getId();
        }
        throw new IllegalStateException("No logged‑in user");
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User toggleLockState(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // user.setAccountLocked(!user.isAccountLocked());
            user.setEnabled(!user.isEnabled());
            return userRepository.save(user);
        }
        return null;
    }

    public boolean isResetTokenValid(String token) {
        System.out.println("Checking token validity for token: " + token);
        Optional<User> userOpt = userRepository.findByResetToken(token);

        if (userOpt.isEmpty()) {
            System.out.println("Token not found in database.");
            return false;
        }

        User user = userOpt.get();
        LocalDateTime expiration = user.getResetTokenExpiration();
        LocalDateTime now = LocalDateTime.now();

        if (expiration == null) {
            System.out.println("Token exists but has no expiration date.");
            return false;
        }

        System.out.println("Token expiration: " + expiration + ", now: " + now);
        boolean isValid = expiration.isAfter(now);
        System.out.println("Is token still valid? " + isValid);
        return isValid;
    }

    public boolean sendResetPasswordLink(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            String token = UUID.randomUUID().toString();
            LocalDateTime expiration = LocalDateTime.now().plusMinutes(30);

            user.setResetToken(token);
            user.setResetTokenExpiration(expiration);
            userRepository.save(user);

            String resetUrl = "http://localhost:4200/reset-password?token=" + token;
            System.out.println("Reset URL: " + resetUrl);

            try {
                emailService.sendEmail(
                        user.getEmail(),
                        user.getFirstname(),
                        EmailTemplateName.FORGOT_PASSWORD,
                        resetUrl,
                        "",
                        "Reset your password"
                );
            } catch (MessagingException e) {
                System.out.println("Failed to send email: " + e.getMessage());
                throw new RuntimeException(e);
            }

            return true;
        } else {
            System.out.println("No user found with email: " + email);
            return false;
        }
    }

    public boolean resetPassword(String token, String newPassword) {
        System.out.println("Searching for user with reset token: " + token);
        Optional<User> userOpt = userRepository.findByResetToken(token.trim());


        if (userOpt.isEmpty()) {
            System.out.println("Token not found in database.");
            return false;
        }

        User user = userOpt.get();
        System.out.println("User found: " + user.getEmail());
        System.out.println("Token expiration: " + user.getResetTokenExpiration());

        if (user.getResetTokenExpiration() == null || user.getResetTokenExpiration().isBefore(LocalDateTime.now())) {
            System.out.println("Token expired");
            return false;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiration(null);
        userRepository.save(user);
        System.out.println("Password successfully reset for user: " + user.getEmail());
        return true;
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUserProfile(Long userId, EditProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        if (request.getFirstname() != null && !request.getFirstname().isEmpty()) {
            user.setFirstname(request.getFirstname());
        }

        if (request.getLastname() != null && !request.getLastname().isEmpty()) {
            user.setLastname(request.getLastname());
        }

        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }


        return userRepository.save(user);
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New password and confirmation do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

    }

    public User updateProfileImage(Long userId, String base64Image) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setImage(base64Image);
        return userRepository.save(user);
    }
}