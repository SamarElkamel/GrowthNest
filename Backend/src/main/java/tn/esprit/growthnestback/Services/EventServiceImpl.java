package tn.esprit.growthnestback.Services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Event;
import tn.esprit.growthnestback.Entities.EventStatus;
import tn.esprit.growthnestback.Entities.EventWithReservationCount;
import tn.esprit.growthnestback.Repository.EventRepository;

import java.util.Date;
import java.util.List;
@Service
@Transactional
@NoArgsConstructor
@Slf4j
@AllArgsConstructor

public class EventServiceImpl implements IEventServices{
    @Autowired
    EventRepository eventRepository;

    @Override
    public List<Event> DisplayAllEvents() {
        return eventRepository.findByStatusIn(List.of(EventStatus.PLANNED, EventStatus.ONGOING));
    }


    @Override
    public Event DisplayEvents(Long idE) {
        return eventRepository.findById(idE).get();
    }

    @Override
    public Event addEvent(Event event) {
        if (event.getStatus() == null) {
            event.setStatus(event.getDate().after(new Date())
                    ? EventStatus.PLANNED
                    : EventStatus.ONGOING);
        }
        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Event event) {

        // If status is being changed to CANCELED, add history note if not present
        if (event.getStatus() == EventStatus.CANCELED) {
            Event existingEvent = eventRepository.findById(event.getIdEvent()).orElse(null);
            if (existingEvent != null && existingEvent.getStatus() != EventStatus.CANCELED) {
                if (event.getHistory() == null || event.getHistory().isEmpty()) {
                    event.setHistory("Event was canceled by admin");
                }
            }
        }
        return eventRepository.save(event);
    }

    @Override
    public List<Event> DisplayEventHistory() {
        return eventRepository.findByStatusIn(List.of(EventStatus.CANCELED, EventStatus.COMPLETED));
    }
    @Override
    public List<EventWithReservationCount> getAvailableEventsWithReservationCount() {
        List<EventStatus> availableStatuses = List.of(EventStatus.PLANNED, EventStatus.ONGOING);
        List<Object[]> results = eventRepository.findAvailableEventsWithReservationCount(availableStatuses);

        return results.stream()
                .map(result -> new EventWithReservationCount(
                        (Event) result[0],
                        (Long) result[1]
                ))
                .toList();
    }

}

