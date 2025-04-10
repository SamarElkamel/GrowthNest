package tn.esprit.growthnestback.Controller;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Reclamation;
import tn.esprit.growthnestback.Services.IReclamationServices;
import java.util.List;
@AllArgsConstructor
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/reclamation")
@Tag(name = "reclamation", description = "API for managing customer reclamation")
public class ReclamationController {
    @Autowired
    IReclamationServices ireclamationServices;
    @Operation(summary = "Retrieve all reclamations")
    @GetMapping("retrieveAllReclamations")
    public List<Reclamation> getAllReclamations() {
        return ireclamationServices.retrieveAllReclamation();
    }
    @Operation(summary = "Retrieve a reclamation by ID")
    @GetMapping("/retrieveReclamation/{idR}")
    public Reclamation getReclamationById(@PathVariable("idR") long reclamationId) {
        return ireclamationServices.retrieveReclamation(reclamationId);
    }
    @Operation(summary = "Add a new reclamation")
    @PostMapping("/addReclamation")
    public Reclamation addReclamation(@RequestBody Reclamation reclamation) {
        return ireclamationServices.addReclamation(reclamation);
    }
    @Operation(summary = "Update an existing reclamation")
    @PutMapping("/updateReclamation")
    public Reclamation updateReclamation(@RequestBody Reclamation reclamation) {
        return ireclamationServices.updateReclamation(reclamation);
    }
    @Operation(summary = "Delete a reclamation")
    @DeleteMapping("/deleteReclamation/{idR}")
    public void deleteReclamation(@PathVariable("idR") long reclamationId) {
        ireclamationServices.deleteReclamation(reclamationId);
    }
}
