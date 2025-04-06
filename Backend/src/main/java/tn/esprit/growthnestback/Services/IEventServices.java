package tn.esprit.growthnestback.Services;

import tn.esprit.growthnestback.Entities.Event;

import java.util.List;

public interface IEventServices {
    public List<Event> DisplayAllEvents();
    public Event DisplayEvents(Long idE);
    public Event addEvent(Event event);
    public Event updateEvent(Event event);
}
