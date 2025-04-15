import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ProgressDTO } from 'src/app/models/progress.model';
import { ProgresService } from 'src/app/services/progres.service';

@Component({
  selector: 'app-user-progress',
  templateUrl: './user-progress.component.html',
  styleUrls: ['./user-progress.component.scss']
})
export class UserProgressComponent implements OnInit {
  userId = 1;

  progressData: ProgressDTO | null = null;
  currentPoints = 0;

  constructor(private progressService: ProgresService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.progressService.fetchProgress(this.userId);
    this.progressService.getProgress().subscribe(data => {
      if (data) {
        this.progressData = data;
        this.currentPoints = data.totalSeeds;
        console.log("Loaded progress:", data);
        this.cdr.detectChanges();
      }
    });
  }

  getBadgeImage(): string {
    if (this.currentPoints >= 3000) return 'assets/images/birds/fledgling.png';
    if (this.currentPoints >= 1000) return 'assets/images/birds/nestling.png';
    return 'assets/images/birds/hatchling.png';
  }

  getBadgeText(): string {
    if (this.currentPoints >= 3000) return 'You’re flying now — amazing support!';
    if (this.currentPoints >= 1000) return 'You’ve taken your first flight!';
    return 'Welcome hatchling!';
  }

  getProgressPercent(): number {
    if (this.currentPoints < 1000) return (this.currentPoints / 1000) * 100;
    if (this.currentPoints < 3000) return ((this.currentPoints - 1000) / 2000) * 100;
    console.log("Points loaded:", this.currentPoints);
    return 100;
  }
}