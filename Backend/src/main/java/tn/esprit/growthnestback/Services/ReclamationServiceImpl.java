package tn.esprit.growthnestback.Services;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Reclamation;
import tn.esprit.growthnestback.Repository.ReclamationRepository;
import java.util.List;
@Service
@AllArgsConstructor
public class ReclamationServiceImpl implements IReclamationServices {
    @Autowired
    ReclamationRepository reclamationRepository;
    @Override
    public List<Reclamation> retrieveAllReclamation() {
        return reclamationRepository.findAll();
    }
    @Override
    public Reclamation retrieveReclamation(Long reclamationId) {
        return reclamationRepository.findById(reclamationId).orElse(null);
    }
    @Override
    public Reclamation addReclamation(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }
    @Override
    public Reclamation updateReclamation(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }
    @Override
    public void deleteReclamation(Long reclamationId) {
        reclamationRepository.deleteById(reclamationId);
    }
}
