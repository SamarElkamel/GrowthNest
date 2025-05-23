package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.growthnestback.Entities.Event;
import tn.esprit.growthnestback.Entities.Registration;
import tn.esprit.growthnestback.Entities.ReservationStatus;
import tn.esprit.growthnestback.Entities.User;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration,Long> {
    @Query("SELECT r FROM Registration r WHERE r.user.id = :userId AND r.event.idEvent = :eventId")
    Optional<Registration> findByUserIdAndEventId(@Param("userId") Long userId, @Param("eventId") Long eventId);




    @Query("SELECT r FROM Registration r WHERE r.event.idEvent = :eventId")
    List<Registration> findByEventId(@Param("eventId") Long eventId);
    @Query("SELECT r FROM Registration r WHERE r.user.id = :userId ORDER BY r.reservationDate DESC")
    List<Registration> findByUserId(@Param("userId") Long userId);
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.idEvent = :eventId AND r.status IN (:statuses)")
    long countByEventIdAndStatuses(@Param("eventId") Long eventId, @Param("statuses") List<ReservationStatus> statuses);

    long countByStatus(ReservationStatus status);

    @Query("SELECT COUNT(DISTINCT r.user) FROM Registration r")
    long countDistinctByUser();

    @Query("SELECT r.event FROM Registration r GROUP BY r.event ORDER BY COUNT(r) DESC LIMIT 1")
    Event findMostRegisteredEvent();
}
