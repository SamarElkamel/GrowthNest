package tn.esprit.growthnestback.Services;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Reclamation;
import tn.esprit.growthnestback.Entities.ReclamationStatus;
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
    // Traitement automatique chaque jour à 2h du matin
    @Scheduled(cron = "0 */10 * * * *")
    public void processReclamations() {
        List<Reclamation> pendingRecs = reclamationRepository.findAll()
                .stream()
                .filter(r -> r.getStatus() == ReclamationStatus.PENDING)
                .toList();

        for (Reclamation rec : pendingRecs) {
            // Simuler un traitement automatique simple
            rec.setStatus(ReclamationStatus.IN_PROGRESS);
            reclamationRepository.save(rec);
        }

        System.out.println("Traitement auto des réclamations exécuté !");
    }
}
