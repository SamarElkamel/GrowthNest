package tn.esprit.growthnestback.Services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class CaptchaService {

    private final String SECRET_KEY = "6LfIuhsrAAAAAMBqCpw5dtEu9oP-7kGLwwNSuAe1";
    private final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean verifyCaptcha(String captcha) {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> body = new HashMap<>();
        body.put("secret", SECRET_KEY);
        body.put("response", captcha);  // Use the 'captcha' received from the frontend

        ResponseEntity<Map> response = restTemplate.postForEntity(
                VERIFY_URL + "?secret={secret}&response={response}",
                null,
                Map.class,
                body
        );

        Map<String, Object> responseBody = response.getBody();
        return (Boolean) responseBody.get("success");
    }
}
