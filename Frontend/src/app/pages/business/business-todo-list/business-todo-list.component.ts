import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GestionDesBusinessService } from 'src/app/services/services';
import { Task, Priority, Status } from 'src/app/services/models/business';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-business-todo-list',
  templateUrl: './business-todo-list.component.html',
  styleUrls: ['./business-todo-list.component.scss']
})
export class BusinessTodoListComponent implements OnInit {
  @Input() businessId!: number;
  todoTasks: Task[] = [];
  doingTasks: Task[] = [];
  doneTasks: Task[] = [];
  taskForm: FormGroup;
  priorityOptions = Object.values(Priority);
  isLoading = false;

  constructor(
    private businessService: GestionDesBusinessService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(255)]],
      priority: [Priority.MEDIUM, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.businessService.getTasksByBusiness({ businessId: this.businessId }).subscribe({
      next: (tasks) => {
        this.todoTasks = tasks.filter(task => task.status === Status.TODO);
        this.doingTasks = tasks.filter(task => task.status === Status.DOING);
        this.doneTasks = tasks.filter(task => task.status === Status.DONE);
        this.isLoading = false;
        console.log('Tasks loaded:', { todo: this.todoTasks, doing: this.doingTasks, done: this.doneTasks });
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Erreur lors du chargement des tâches', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
        console.error('Error loading tasks:', err);
      }
    });
  }

  addTask(): void {
    if (this.taskForm.valid) {
      const task: Omit<Task, 'id' | 'status' | 'order'> = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        priority: this.taskForm.value.priority,
        business: { idBusiness: this.businessId }
      };
      const newTask: Task = {
        ...task,
        id: 0, // Temporary ID, will be ignored by backend
        status: Status.TODO,
        order: this.todoTasks.length
      };
      this.businessService.addTask({ businessId: this.businessId, body: newTask }).subscribe({
        next: (savedTask) => {
          this.todoTasks.push(savedTask);
          this.taskForm.reset({ priority: Priority.MEDIUM });
          this.snackBar.open('Tâche ajoutée avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error adding task for businessId=' + this.businessId, err);
          this.snackBar.open('Erreur lors de l\'ajout de la tâche: ' + err.message, 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormAsTouched();
    }
  }

  logDropEnter(listId: string): void {
    console.log(`Drag entered drop list: ${listId}`);
  }

  drop(event: CdkDragDrop<Task[]>): void {
    console.log('Drop event:', {
      previousContainer: event.previousContainer.id,
      container: event.container.id,
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
      item: event.item.data
    });

    // Store original state for potential reversion
    const originalTodoTasks = [...this.todoTasks];
    const originalDoingTasks = [...this.doingTasks];
    const originalDoneTasks = [...this.doneTasks];

    if (event.previousContainer.id === event.container.id) {
      // Reorder within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log(`Reordered within ${event.container.id}:`, event.container.data);
    } else {
      // Move between lists
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update status based on the new container
      const task = event.container.data[event.currentIndex];
      if (event.container.id === 'todoList') {
        task.status = Status.TODO;
      } else if (event.container.id === 'doingList') {
        task.status = Status.DOING;
      } else if (event.container.id === 'doneList') {
        task.status = Status.DONE;
      }
      console.log(`Moved task ${task.id} to ${event.container.id}, new status: ${task.status}`);
    }

    // Update order and status in backend
    const allTasks = [
      ...this.todoTasks.map((task, index) => ({ ...task, order: index, status: Status.TODO })),
      ...this.doingTasks.map((task, index) => ({ ...task, order: index, status: Status.DOING })),
      ...this.doneTasks.map((task, index) => ({ ...task, order: index, status: Status.DONE }))
    ];

    console.log('Sending to reorderTasks:', allTasks);

    this.businessService.reorderTasks({ businessId: this.businessId, body: allTasks }).subscribe({
      next: () => {
        this.snackBar.open('Tâches réorganisées', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        console.log('Tasks reordered successfully');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error reordering tasks:', err);
        // Revert state on error
        this.todoTasks = originalTodoTasks;
        this.doingTasks = originalDoingTasks;
        this.doneTasks = originalDoneTasks;
        this.snackBar.open('Erreur lors de la réorganisation des tâches: ' + (err.error?.error || err.message), 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteTask(taskId: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      this.businessService.deleteTask({ taskId }).subscribe({
        next: () => {
          this.todoTasks = this.todoTasks.filter(t => t.id !== taskId);
          this.doingTasks = this.doingTasks.filter(t => t.id !== taskId);
          this.doneTasks = this.doneTasks.filter(t => t.id !== taskId);
          this.snackBar.open('Tâche supprimée', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open('Erreur lors de la suppression de la tâche', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Error deleting task:', err);
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.taskForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('minlength')) {
      return `Minimum ${control.errors?.['minlength'].requiredLength} caractères`;
    }
    if (control?.hasError('maxlength')) {
      return `Maximum ${control.errors?.['maxlength'].requiredLength} caractères`;
    }
    return '';
  }

  private markFormAsTouched(): void {
    Object.values(this.taskForm.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }
} 