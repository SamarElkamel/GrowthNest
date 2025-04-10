package tn.esprit.growthnestback.Services;
import java.util.List;
import tn.esprit.growthnestback.Entities.Reclamation;
public interface IReclamationServices {
    List<Reclamation> retrieveAllReclamation();
    Reclamation retrieveReclamation(Long reclamationId);
    Reclamation addReclamation(Reclamation reclamation);
    Reclamation updateReclamation(Reclamation reclamation);
    void deleteReclamation(Long reclamationId);
}
