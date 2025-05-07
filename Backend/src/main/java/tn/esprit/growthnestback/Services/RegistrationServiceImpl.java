package tn.esprit.growthnestback.Services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.*;
import tn.esprit.growthnestback.Repository.EventRepository;
import tn.esprit.growthnestback.Repository.NotificationRepository;
import tn.esprit.growthnestback.Repository.RegistrationRepository;
import tn.esprit.growthnestback.Repository.UserRepository;

import java.util.*;

@Service
@Slf4j
@Transactional
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationServiceImpl implements IRegistrationServices {
    @Autowired
    RegistrationRepository registrationRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    EventRepository eventRepository;
    @Autowired
    NotificationRepository notificationRepository;

    @Override
    public List<Registration> DisplayAllRegistartion() {
        return registrationRepository.findAll();
    }

    @Override
    public Registration DisplayRegistration(Long idR) {
        return registrationRepository.findById(idR).get();
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

    @Override
    public List<Registration> getUserReservations(Long userId) {
        return registrationRepository.findByUserId(userId);
    }

    @Override
    public Registration addRegistration(Registration registration) {
        Long userId = registration.getUser().getId();
        Long eventId = registration.getEvent().getIdEvent();
        log.info("Adding registration for userId={}, eventId={}", userId, eventId);

        // Step 1: Check if registration already exists
        Optional<Registration> existingRegistration =
                registrationRepository.findByUserIdAndEventId(userId, eventId);
        if (existingRegistration.isPresent()) {
            log.warn("User {} already registered for event {}", userId, eventId);
            throw new RuntimeException("User is already registered for this event");
        }

        // Step 2: Fetch user and event from DB
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Step 3: Check available places (CONFIRMED and PENDING)
        if (event.getNumberOfPlaces() != null) {
            List<ReservationStatus> statuses = List.of(ReservationStatus.CONFIRMED, ReservationStatus.PENDING);
            long registrationCount = registrationRepository.countByEventIdAndStatuses(eventId, statuses);
            log.info("Event {}: {} registrations, {} places available", eventId, registrationCount, event.getNumberOfPlaces());
            if (registrationCount >= event.getNumberOfPlaces()) {
                throw new RuntimeException("No available places for this event");
            }
        }

        // Step 4: Create and save new registration with PENDING status
        Registration newRegistration = new Registration();
        newRegistration.setUser(user);
        newRegistration.setEvent(event);
        newRegistration.setStatus(ReservationStatus.PENDING);
        newRegistration.setReservationDate(new Date());

        Registration savedRegistration = registrationRepository.save(newRegistration);
        log.info("Registration saved: id={}", savedRegistration.getIdRegist());

        // Step 5: Create notification for admin
        try {
            String message = String.format("New registration for event '%s' by user '%s'",
                    event.getTitle(), user.getUsername());
            Notification notification = new Notification(savedRegistration, message);
            notificationRepository.save(notification);
            log.info("Notification created for registration {}", savedRegistration.getIdRegist());
        } catch (Exception e) {
            log.error("Failed to create notification for registration {}", savedRegistration.getIdRegist(), e);
        }

        return savedRegistration;
    }

    @Override
    public Registration updateRegistrationStatus(Long registrationId, ReservationStatus newStatus) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new EntityNotFoundException("Registration not found"));

        // Validate status transition
        if (registration.getStatus() != ReservationStatus.PENDING) {
            throw new RuntimeException("Can only update status of PENDING registrations");
        }
        if (newStatus != ReservationStatus.CONFIRMED && newStatus != ReservationStatus.CANCELED) {
            throw new RuntimeException("Invalid status transition");
        }

        // Check available places for confirmation
        if (newStatus == ReservationStatus.CONFIRMED) {
            Event event = registration.getEvent();
            if (event.getNumberOfPlaces() != null) {
                Long confirmedCount = eventRepository.countConfirmedRegistrationsByEventId(event.getIdEvent());
                if (confirmedCount >= event.getNumberOfPlaces()) {
                    throw new RuntimeException("No available places to confirm this registration");
                }
            }
        }

        registration.setStatus(newStatus);
        return registrationRepository.save(registration);
    }

    @Override
    public Map<String, Object> getAnalyticsData() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRegistrations", registrationRepository.count());
        stats.put("confirmed", registrationRepository.countByStatus(ReservationStatus.CONFIRMED));
        stats.put("cancelled", registrationRepository.countByStatus(ReservationStatus.CANCELED));
        stats.put("pending", registrationRepository.countByStatus(ReservationStatus.PENDING));
        stats.put("uniqueUsers", registrationRepository.countDistinctByUser());
        stats.put("mostPopularEvent", registrationRepository.findMostRegisteredEvent());
        stats.put("unreadNotifications", notificationRepository.countByIsReadFalse());
        return stats;
    }
}