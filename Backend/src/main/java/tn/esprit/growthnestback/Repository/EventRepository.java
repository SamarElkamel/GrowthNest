package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.growthnestback.Entities.Event;
import tn.esprit.growthnestback.Entities.EventStatus;

import java.util.List;

public interface EventRepository extends JpaRepository<Event,Long> {
    @Query("SELECT e FROM Event e WHERE e.status IN :statuses")
    List<Event> findByStatusIn(@Param("statuses") List<EventStatus> statuses);
    List<Event> findByStatus(EventStatus status);

}
