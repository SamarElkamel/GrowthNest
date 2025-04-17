package tn.esprit.growthnestback.Controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.AuthenticationRequest;
import tn.esprit.growthnestback.Entities.AuthenticationResponse;
import tn.esprit.growthnestback.Entities.RegistrationRequest;
import tn.esprit.growthnestback.Services.AuthenticationService;
import tn.esprit.growthnestback.Services.CaptchaService;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication")
public class AuthenticationController {

    private final AuthenticationService service;
    private final CaptchaService captchaService;

    @Autowired
    public AuthenticationController(AuthenticationService service, CaptchaService captchaService) {
        this.service = service;
        this.captchaService = captchaService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid RegistrationRequest request
    ) throws MessagingException {
        service.register(request);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/authenticate")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody @Valid AuthenticationRequest request
    ) {

        boolean captchaVerified = captchaService.verifyCaptcha(request.getCaptcha());
        if (!captchaVerified) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); 
        }

        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/activate-account")
    public void confirm(
            @RequestParam String token
    ) throws MessagingException {
        service.activateAccount(token);
    }
}
