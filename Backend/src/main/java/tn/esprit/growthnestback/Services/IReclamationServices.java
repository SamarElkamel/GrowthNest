package tn.esprit.growthnestback.Services;

import java.util.List;
import tn.esprit.growthnestback.Entities.Reclamation;

public interface IReclamationServices {

    public List<Reclamation> retrieveAllReclamation();

    public Reclamation retrieveReclamation(Long reclamationId);
}
