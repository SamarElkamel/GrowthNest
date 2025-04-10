package tn.esprit.growthnestback.Services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Event;
import tn.esprit.growthnestback.Entities.Registration;
import tn.esprit.growthnestback.Entities.ReservationStatus;
import tn.esprit.growthnestback.Entities.User;
import tn.esprit.growthnestback.Repository.EventRepository;
import tn.esprit.growthnestback.Repository.RegistrationRepository;
import tn.esprit.growthnestback.Repository.UserRepository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@Transactional
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationServiceImpl implements IRegistrationServices{
    @Autowired
    RegistrationRepository registrationRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    EventRepository eventRepository;
    @Override
    public List<Registration> DisplayAllRegistartion() {
        return registrationRepository.findAll();
    }

    @Override
    public Registration DisplayRegistration(Long idR) {
        return registrationRepository.findById(idR).get();
    }

    @Override
    public Registration addRegistration(Registration registration) {

        Long userId = registration.getUser().getId();
        Long eventId = registration.getEvent().getIdEvent();

        // Step 1: Check if registration already exists
        Optional<Registration> existingRegistration =
                registrationRepository.findByUserIdAndEventId(userId, eventId);

        if (existingRegistration.isPresent()) {
            // You can return existing or throw exception depending on logic
            return existingRegistration.get(); // or throw new RuntimeException("Already registered");
        }

        // Step 2: Fetch user and event from DB
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Step 3: Create and save new registration
        Registration newRegistration = new Registration();
        newRegistration.setUser(user);
        newRegistration.setEvent(event);
        newRegistration.setStatus(ReservationStatus.CONFIRMED);
        newRegistration.setReservationDate(new Date());

        return registrationRepository.save(newRegistration);
    }

    @Override
    public Registration updateRegistration(Registration registration) {
        return registrationRepository.save(registration);
    }

    @Override
    public void deleteRegistration(Long idR) {
        registrationRepository.deleteById(idR);
    }
    @Override
    public List<Registration> DisplayRegistrationsByEvent(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }
}
