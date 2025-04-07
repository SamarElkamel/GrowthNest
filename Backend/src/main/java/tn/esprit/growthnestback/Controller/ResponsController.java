package tn.esprit.growthnestback.Controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.growthnestback.Entities.Respons;
import tn.esprit.growthnestback.Services.IResponsService;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/respons")
public class ResponsController {
    @Autowired
    IResponsService responsService;
    @GetMapping("/dispalyallrespons")
    public List<Respons> getAllRespons(){ return responsService.displayallRespons();}
    @GetMapping("/displayrespons/{id}")
    public Respons getRespons(@PathVariable("id") long id){ return responsService.displayRespons(id);}
    @PostMapping("/addrespons")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Respons addRespons(@RequestBody Respons respons, @RequestHeader("Authorization") String authHeader) {
        return responsService.createRespons(respons, authHeader);
    }
    @PatchMapping("/updaterespons")
    public Respons updateRespons(@RequestBody Respons respons){return responsService.updateRespons(respons);}
    @DeleteMapping("/deleterespons/{id}")
    public void deleteRespons(@PathVariable("id") long id){responsService.deleteRespons(id);}
}
