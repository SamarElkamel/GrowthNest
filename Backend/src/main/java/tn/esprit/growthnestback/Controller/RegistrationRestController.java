package tn.esprit.growthnestback.Controller;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.growthnestback.Entities.Registration;
import tn.esprit.growthnestback.Entities.ReservationStatus;
import tn.esprit.growthnestback.Services.IRegistrationServices;
import tn.esprit.growthnestback.Services.PdfExportService;
import org.springframework.http.HttpHeaders;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/Registration")
@Tag(name = "Registration Management")
public class RegistrationRestController {
    @Autowired
    IRegistrationServices iRegistrationServices;

    @Autowired
    private PdfExportService pdfExportService;
    @Operation(description = "Display All Registration")
    @GetMapping("/DisplayAllRegistration")
    public List<Registration> Display(){
        return iRegistrationServices.DisplayAllRegistartion();
    }
    @Operation(description = "Display Registration By ID ")
    @GetMapping("/DisplayRegistration/{idR}")
    public Registration DisplayRegistration(@PathVariable("idR") Long idR){
        return iRegistrationServices.DisplayRegistration(idR);
    }
    @Operation(description = "AddRegistration")
    @PostMapping("/addRegistration")
    public Registration addRegistration(@RequestBody Registration registration){
        return iRegistrationServices.addRegistration(registration);
    }
    @Operation(description = "UpdateRegistration")
    @PutMapping("/updateRegistration")
    public Registration updateRegistration(@RequestBody Registration registration){
        return iRegistrationServices.updateRegistration(registration);
    }

    @Operation(description = "DeleteRegistration")
    @DeleteMapping("/deleteRegistration/{idR}")
    public void deleteRegistration(@PathVariable("idR") Long idR){
        iRegistrationServices.deleteRegistration(idR);
    }
    @Operation(description = "Display Registrations By Event ID")
    @GetMapping("/DisplayByEvent/{eventId}")
    public List<Registration> DisplayByEvent(@PathVariable("eventId") Long eventId){
        return iRegistrationServices.DisplayRegistrationsByEvent(eventId);
    }
    @Operation(description = "Get user's reservation history")
    @GetMapping("/user/{userId}")
    public List<Registration> getUserReservations(@PathVariable Long userId) {
        return iRegistrationServices.getUserReservations(userId);
    }
    @Operation(description = "Admin confirm or cancel registration")
    @PutMapping("/updateStatus/{idR}")
    public Registration updateRegistrationStatus(
            @PathVariable("idR") Long idR,
            @RequestParam ReservationStatus status) {
        return iRegistrationServices.updateRegistrationStatus(idR, status);
    }
    @Operation(description = "Download event invitation PDF")
    @GetMapping("/downloadInvitation/{idR}")
    public ResponseEntity<byte[]> downloadInvitation(@PathVariable("idR") Long idR) throws IOException {
        Registration registration = iRegistrationServices.DisplayRegistration(idR);

        if (registration.getStatus() != ReservationStatus.CONFIRMED) {
            throw new IllegalStateException("Invitation can only be downloaded for confirmed reservations");
        }

        byte[] pdfBytes = pdfExportService.generateEventInvitationPdf(registration);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "event_invitation.pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

}
