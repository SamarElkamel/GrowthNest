package tn.esprit.growthnestback.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.DeliveryAgency;
import tn.esprit.growthnestback.Services.IDeliveryAgencyService;

import java.util.List;

@AllArgsConstructor
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/delivery-agency")
@Tag(name = "Delivery Agency", description = "API for managing delivery agencies")
public class DeliveryAgencyController {

    @Autowired
    IDeliveryAgencyService deliveryAgencyService;

    @Operation(summary = "Retrieve all delivery agencies")
    @GetMapping("/all")
    public List<DeliveryAgency> getAllDeliveryAgencies() {
        return deliveryAgencyService.retrieveAllDeliveryAgencies();
    }

    @Operation(summary = "Retrieve a delivery agency by ID")
    @GetMapping("/{id}")
    public DeliveryAgency getDeliveryAgencyById(@PathVariable("id") long agencyId) {
        return deliveryAgencyService.retrieveDeliveryAgency(agencyId);
    }

    @Operation(summary = "Add a new delivery agency")
    @PostMapping("/add")
    public DeliveryAgency addDeliveryAgency(@RequestBody DeliveryAgency deliveryAgency) {
        return deliveryAgencyService.addDeliveryAgency(deliveryAgency);
    }

    @Operation(summary = "Update an existing delivery agency")
    @PutMapping("/update")
    public DeliveryAgency updateDeliveryAgency(@RequestBody DeliveryAgency deliveryAgency) {
        return deliveryAgencyService.updateDeliveryAgency(deliveryAgency);
    }

    @Operation(summary = "Delete a delivery agency by ID")
    @DeleteMapping("/delete/{id}")
    public void deleteDeliveryAgency(@PathVariable("id") long agencyId) {
        deliveryAgencyService.deleteDeliveryAgency(agencyId);
    }
}
