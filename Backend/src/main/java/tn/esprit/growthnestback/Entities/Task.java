package tn.esprit.growthnestback.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "task")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;


    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "task_order")
    private Integer order;

    @ManyToOne
    @JoinColumn(name = "business_id")
    @JsonBackReference
    private Business business;

    public enum Priority {
        LOW, MEDIUM, HIGH
    }
    public enum Status {
        TODO, DOING, DONE
    }

        public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public boolean isCompleted() {
        return status == Status.DONE;
    }

    public void setCompleted(boolean completed) {
            this.status = completed ? Status.DONE : (this.status == Status.DONE ? Status.TODO : this.status);
            }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }
}
