package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Registration;
import tn.esprit.growthnestback.Entities.ReservationStatus;

import java.util.List;

public interface IRegistrationServices {
    public List<Registration> DisplayAllRegistartion();
    public Registration DisplayRegistration(Long idR);
    public Registration addRegistration(Registration registration);
    public Registration updateRegistration(Registration registration);
    public void deleteRegistration (Long idR);
    public List<Registration> DisplayRegistrationsByEvent(Long eventId);
    List<Registration> getUserReservations(Long userId);
    Registration updateRegistrationStatus(Long registrationId, ReservationStatus newStatus);
}
