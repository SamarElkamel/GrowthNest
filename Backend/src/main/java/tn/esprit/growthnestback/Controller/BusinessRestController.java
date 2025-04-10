package tn.esprit.growthnestback.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.Services.IBusinessService;

import java.util.List;
@Validated
@AllArgsConstructor
@RestController
@Tag(name="gestion des business")
@RequestMapping("/business")
public class BusinessRestController {
    @Autowired
    IBusinessService iBusinessService;
    @Operation(description = "afficher tous les business")

    @GetMapping("/getAllBusiness")
    public List<Business> getAllBusiness(){
        return iBusinessService.getAllBusiness();
    }
    @Operation(description = "afficher un business selon l'id ")
    @GetMapping("/getBusinessById/{idB}")
    public Business getBusinessById(@PathVariable("idB") Long id){
        return iBusinessService.getBusinessById(id);
    }
    @Operation(description = "ajouter un business")
    @PostMapping("/addBusiness")
    public Business addBusiness(@RequestBody Business business){
        return iBusinessService.addBusiness(business);
    }
    @Operation(description = "modifier un business")
    @PutMapping("/updateBusiness")
    public Business updateBusiness(@RequestBody Business business){
        return iBusinessService.updateBusiness(business);
    }
    @Operation(description = "supprimer un business")
    @DeleteMapping("/deleteBusiness/{idB}")
    public void deleteBusiness(@PathVariable("idB") Long idB){
        iBusinessService.deleteBusiness(idB);
    }
}
