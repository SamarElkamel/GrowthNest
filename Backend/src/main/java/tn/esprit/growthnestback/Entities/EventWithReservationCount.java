package tn.esprit.growthnestback.Entities;

import lombok.Data;

@Data
public class EventWithReservationCount {
    private Event event;
    private Long reservationCount;

    public EventWithReservationCount(Event event, Long reservationCount) {
        this.event = event;
        this.reservationCount = reservationCount;
    }
}