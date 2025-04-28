package tn.esprit.growthnestback.Services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.growthnestback.Entities.Business;
import tn.esprit.growthnestback.Entities.Task;
import tn.esprit.growthnestback.Repository.BusinessRepository;
import tn.esprit.growthnestback.Repository.TaskRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private UserService userService;

    public Task addTask(Long businessId, Task task) {
        logger.info("Adding task for business ID: {}", businessId);
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new IllegalArgumentException("Business not found with ID: " + businessId));

        Long currentUserId = UserService.currentUserId();
        if (!business.getUser().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Vous n'êtes pas autorisé à ajouter des tâches pour ce business");
        }

        task.setId(null); // Ignores any sent ID
        task.setBusiness(business);
        task.setStatus(task.getStatus() != null ? task.getStatus() : Task.Status.TODO);
        List<Task> tasks = taskRepository.findByBusinessIdBusinessAndStatusOrderByOrderAsc(businessId, task.getStatus());
        task.setOrder(tasks.isEmpty() ? 0 : tasks.get(tasks.size() - 1).getOrder() + 1);
        Task savedTask = taskRepository.save(task);
        logger.info("Task added: ID={}, Title={}, Status={}", savedTask.getId(), savedTask.getTitle(), savedTask.getStatus());
        return savedTask;
    }

    public List<Task> getTasksByBusiness(Long businessId) {
        logger.info("Fetching tasks for business ID: {}", businessId);
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new IllegalArgumentException("Business not found with ID: " + businessId));

        Long currentUserId = UserService.currentUserId();
        if (!business.getUser().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Vous n'êtes pas autorisé à voir les tâches de ce business");
        }

        return taskRepository.findByBusinessIdBusinessOrderByStatusAscOrderAsc(businessId);
    }

    public Task updateTask(Long taskId, Task updatedTask) {
        logger.info("Updating task ID: {}", taskId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        Long currentUserId = UserService.currentUserId();
        if (!task.getBusiness().getUser().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Vous n'êtes pas autorisé à modifier cette tâche");
        }

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setPriority(updatedTask.getPriority());
        task.setStatus(updatedTask.getStatus());
        task.setOrder(updatedTask.getOrder());
        Task savedTask = taskRepository.save(task);
        logger.info("Task updated: ID={}, Title={}, Status={}", savedTask.getId(), savedTask.getTitle(), savedTask.getStatus());
        return savedTask;
    }

    public void deleteTask(Long taskId) {
        logger.info("Deleting task ID: {}", taskId);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        Long currentUserId = UserService.currentUserId();
        if (!task.getBusiness().getUser().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Vous n'êtes pas autorisé à supprimer cette tâche");
        }

        taskRepository.delete(task);
        logger.info("Task deleted: ID={}", taskId);
    }

    public void reorderTasks(Long businessId, List<Task> tasks) {
        logger.info("Reordering tasks for business ID: {}", businessId);
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new IllegalArgumentException("Business not found with ID: " + businessId));

        Long currentUserId = UserService.currentUserId();
        if (!business.getUser().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Vous n'êtes pas autorisé à réorganiser les tâches de ce business");
        }

        for (int i = 0; i < tasks.size(); i++) {
            final Long taskId = tasks.get(i).getId();
            final Task.Status newStatus = tasks.get(i).getStatus();
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new IllegalArgumentException("Task ID not found: " + taskId));
            task.setStatus(newStatus);
            task.setOrder(i);
            taskRepository.save(task);
        }

        logger.info("Tasks reordered for business ID: {}", businessId);
    }
}