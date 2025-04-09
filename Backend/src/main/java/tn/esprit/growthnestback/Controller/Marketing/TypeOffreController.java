package tn.esprit.growthnestback.Controller.Marketing ;



import tn.esprit.growthnestback.Entities.Marketing.Offre;
import tn.esprit.growthnestback.Entities.Marketing.TypeOffre;
import tn.esprit.growthnestback.Services.Marketing.TypeOffreService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/types-offres")
public class TypeOffreController {
    private final TypeOffreService service;

    public TypeOffreController(TypeOffreService service) {
        this.service = service;
    }

    @GetMapping("/retrieveAllTypes")
    public List<TypeOffre> getAll() {
        return service.getAll();
    }

    @PostMapping("/addType")
    public TypeOffre create(@RequestBody TypeOffre typeOffre) {
        return service.save(typeOffre);
    }
    @DeleteMapping("/deleteType/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
    @GetMapping("/retrieveTypeById/{id}")
    public Optional<TypeOffre> getById(@PathVariable Long id) {
        return service.getById(id);
    }


}

