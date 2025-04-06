package tn.esprit.growthnestback.Services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Event;
import tn.esprit.growthnestback.Repository.EventRepository;

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
        return eventRepository.findAll();
    }

    @Override
    public Event DisplayEvents(Long idE) {
        return eventRepository.findById(idE).get();
    }

    @Override
    public Event addEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Event event) {
        return eventRepository.save(event);
    }
}

