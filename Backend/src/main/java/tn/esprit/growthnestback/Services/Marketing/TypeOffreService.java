package tn.esprit.growthnestback.Services.Marketing ;



import tn.esprit.growthnestback.Entities.Marketing.TypeOffre;
import tn.esprit.growthnestback.Repository.Marketing.TypeOffreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TypeOffreService {
    private final TypeOffreRepository repository;

    public TypeOffreService(TypeOffreRepository repository) {
        this.repository = repository;
    }

    public List<TypeOffre> getAll() {
        return repository.findAll();
    }

    public Optional<TypeOffre> getById(Long id) {
        return repository.findById(id);
    }

    public TypeOffre save(TypeOffre typeOffre) {
        return repository.save(typeOffre);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

