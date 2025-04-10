package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Event;
import tn.esprit.growthnestback.Entities.EventWithReservationCount;

import java.util.List;

public interface IEventServices {
    public List<Event> DisplayAllEvents();
    public Event DisplayEvents(Long idE);
    public Event addEvent(Event event);
    public Event updateEvent(Event event);
    public List<Event> DisplayEventHistory();
    List<EventWithReservationCount> getAvailableEventsWithReservationCount();
}
