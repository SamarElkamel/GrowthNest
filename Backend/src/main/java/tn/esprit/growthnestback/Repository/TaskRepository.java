package tn.esprit.growthnestback.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.growthnestback.Entities.Task;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByBusinessIdBusinessOrderByStatusAscOrderAsc(Long businessId);
    List<Task> findByBusinessIdBusinessAndStatusOrderByOrderAsc(Long businessId, Task.Status status);
}
