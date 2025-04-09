package tn.esprit.growthnestback.Services.Marketing;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MailjetService {

    @Value("${mailjet.api.key}")
    private String apiKey;

    @Value("${mailjet.secret.key}")
    private String secretKey;

    public void sendEmail(String to, String subject, String htmlBody, MultipartFile attachment) throws IOException {
        String url = "https://api.mailjet.com/v3.1/send";

        Map<String, Object> payload = new HashMap<>();

        Map<String, Object> message = new HashMap<>();
        message.put("From", Map.of("Email", "ton.email@domaine.com", "Name", "TonNom"));
        message.put("To", List.of(Map.of("Email", to, "Name", "Destinataire")));
        message.put("Subject", subject);
        message.put("HTMLPart", htmlBody);

        if (attachment != null && !attachment.isEmpty()) {
            String base64File = Base64.getEncoder().encodeToString(attachment.getBytes());
            message.put("Attachments", List.of(Map.of(
                    "ContentType", attachment.getContentType(),
                    "Filename", attachment.getOriginalFilename(),
                    "Base64Content", base64File
            )));
        }

        payload.put("Messages", List.of(message));

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(apiKey, secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Erreur Mailjet : " + response.getBody());
        }
    }
}
