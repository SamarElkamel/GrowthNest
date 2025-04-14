package tn.esprit.growthnestback.Controller;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Registration;
import tn.esprit.growthnestback.Entities.ReservationStatus;
import tn.esprit.growthnestback.Services.IRegistrationServices;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/Registration")
@Tag(name = "Registration Management")
public class RegistrationRestController {
    @Autowired
    IRegistrationServices iRegistrationServices;
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
}
