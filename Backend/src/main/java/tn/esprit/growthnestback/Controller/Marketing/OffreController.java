package tn.esprit.growthnestback.Controller.Marketing ;

import tn.esprit.growthnestback.Entities.Marketing.Offre;
import tn.esprit.growthnestback.Services.Marketing.OffreService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/offres")
public class OffreController {
    private final OffreService service;

    public OffreController(OffreService service) {
        this.service = service;
    }

    @GetMapping("/retrieveAllOffres")
    public List<Offre> getAll() {
        return service.getAll();
    }
    @GetMapping("/retrieveOffre/{id}")
    public Optional<Offre> getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping("/addOffre")
    public Offre create(@RequestBody Offre offre) {
        return service.save(offre);
    }

    @DeleteMapping ("/deleteOffre/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
    @PutMapping("/updateOffre/{id}")
    public Offre update(@PathVariable Long id, @RequestBody Offre offre) {
        return service.update(id, offre);
    }
}

