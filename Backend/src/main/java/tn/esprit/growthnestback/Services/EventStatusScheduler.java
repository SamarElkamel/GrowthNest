package tn.esprit.growthnestback.Services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Event;
import tn.esprit.growthnestback.Entities.EventStatus;
import tn.esprit.growthnestback.Repository.EventRepository;

import java.util.Date;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class EventStatusScheduler {
    private final EventRepository eventRepository;

    // Runs every hour at minute 0
    @Scheduled(cron = "0 0 * * * *")
    public void updateEventStatuses() {
        log.info("Running event status update scheduler...");
        Date now = new Date();

        // 1. Update PLANNED events that should be ONGOING
        eventRepository.findByStatus(EventStatus.PLANNED).stream()
                .filter(event -> event.getDate().before(now))
                .forEach(event -> {
                    event.setStatus(EventStatus.ONGOING);
                    eventRepository.save(event);
                    log.info("Updated event {} from PLANNED to ONGOING", event.getIdEvent());
                });

        // 2. Update ONGOING events that should be COMPLETED
        eventRepository.findByStatus(EventStatus.ONGOING).stream()
                .filter(event -> isEventCompleted(event, now))
                .forEach(event -> {
                    event.setStatus(EventStatus.COMPLETED);
                    eventRepository.save(event);
                    log.info("Updated event {} from ONGOING to COMPLETED", event.getIdEvent());
                });
    }

    private boolean isEventCompleted(Event event, Date now) {
        // More accurate completion check considering end time
        return event.getDate().before(now) &&
                (event.getEndTime() == null ||
                        new Date().after(calculateEndDateTime(event)));
    }

    private Date calculateEndDateTime(Event event) {
        // Combine date and end time into full timestamp
        return new Date(event.getDate().getTime() +
                event.getEndTime().toSecondOfDay() * 1000L);
    }
}