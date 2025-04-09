package tn.esprit.growthnestback.Services.Marketing ;



import tn.esprit.growthnestback.Entities.Marketing.Offre;
import tn.esprit.growthnestback.Repository.Marketing.OffreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OffreService {
    private final OffreRepository repository;

    public OffreService(OffreRepository repository) {
        this.repository = repository;
    }

    public List<Offre> getAll() {
        return repository.findAll();
    }

    public Optional<Offre> getById(Long id) {
        return repository.findById(id);
    }

    public Offre save(Offre offre) {
        return repository.save(offre);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
    public Offre update(Long id, Offre offre) {
        // Vérifier si l'offre existe déjà dans la base de données
        if (repository.existsById(id)) {
            offre.setId(id);  // On définit l'ID de l'offre pour qu'il reste le même
            return repository.save(offre);
        }
        throw new IllegalArgumentException("Offre avec l'ID " + id + " n'existe pas.");
    }
}

