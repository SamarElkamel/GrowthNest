package tn.esprit.growthnestback.Controller.Marketing;

import tn.esprit.growthnestback.Services.Marketing.MailjetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/mailjet")
@CrossOrigin(origins = "*")
public class MailjetController {

    @Autowired
    private MailjetService mailjetService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(
            @RequestParam("to") String to,
            @RequestParam("subject") String subject,
            @RequestParam("body") String body,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment
    ) {
        try {
            mailjetService.sendEmail(to, subject, body, attachment);
            return ResponseEntity.ok("Email envoyé avec Mailjet !");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de l'envoi : " + e.getMessage());
        }
    }
}
