import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

import { ChartData, ChartOptions } from 'chart.js';

export interface TagStats {
  tag: string;
  postCount: number;
  likeCount: number;
  dislikeCount: number;
  responseCount: number;
}

interface DecodedToken {
  authorities: string[]; // correspond à la liste des rôles dans ton token
}

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.scss']
})
export class AdminStatsComponent implements OnInit {
  stats: TagStats[] = [];
  isAdmin = false;
  errorMessage: string | null = null;
  totalPosts = 0;
  loading = false;

  barChartData: ChartData<'bar'> = {
    labels: [], // les tags
    datasets: [
      { data: [], label: 'Posts', backgroundColor: '#42A5F5' },
      { data: [], label: 'Likes', backgroundColor: '#66BB6A' },
      { data: [], label: 'Dislikes', backgroundColor: '#EF5350' },
      { data: [], label: 'Réponses', backgroundColor: '#FFA726' }
    ]
  };
  

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Nombre de posts' } },
      x: { title: { display: true, text: 'Tags' } }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Posts par Tag' }
    }
  };

  barChartType: 'bar' = 'bar';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkAdminRole();
  }

  checkAdminRole(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Veuillez vous connecter.';
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log('Contenu du token décodé :', decoded);

      if (decoded.authorities && decoded.authorities.includes('ROLE_ADMIN')) {
        this.isAdmin = true;
        this.fetchTagStats();
      } else {
        this.errorMessage = 'Accès réservé aux administrateurs.';
      }
    } catch (error) {
      console.error('Erreur de décodage du token', error);
      this.errorMessage = 'Token invalide.';
    }

    this.cdr.detectChanges();
  }

  fetchTagStats(): void {
    this.loading = true;
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Veuillez vous connecter.';
      this.loading = false;
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFkbWluIGFkbWluIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NDU3NjY3NDgsImV4cCI6MTc0NTc3NTM4OCwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.knaBY_4LH_RPMW2LRYZxaFV1q_l9OCuvvrX5Y3AeTd1r4gDY0USzdVNd3P5oMSWA`);

    this.http.get<TagStats[]>('http://localhost:8080/Growthnest/post/stats/details', { headers })
      .subscribe({
        next: (data) => {
          if (!Array.isArray(data)) {
            this.errorMessage = 'Données invalides reçues.';
          } else {
            this.stats = data.filter(stat => stat.tag !== null);
            this.totalPosts = this.stats.reduce((sum, stat) => sum + stat.postCount, 0);
            this.updateChartData();
            this.errorMessage = null;
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des statistiques :', err);
          this.errorMessage = 'Erreur serveur lors de la récupération des statistiques.';
          this.stats = [];
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  getPercentage(postCount: number): number {
    return this.totalPosts > 0 ? (postCount / this.totalPosts) * 100 : 0;
  }

  updateChartData(): void {
    this.barChartData.labels = this.stats.map(stat => stat.tag);
  
    this.barChartData.datasets[0].data = this.stats.map(stat => stat.postCount);
    this.barChartData.datasets[1].data = this.stats.map(stat => stat.likeCount);
    this.barChartData.datasets[2].data = this.stats.map(stat => stat.dislikeCount);
    this.barChartData.datasets[3].data = this.stats.map(stat => stat.responseCount);
  
    this.cdr.detectChanges();
  }
  

  exportToCsv(): void {
    const header = 'Tag,Posts,Likes,Dislikes,Réponses';
    const rows = this.stats.map(stat => 
      `${stat.tag},${stat.postCount},${stat.likeCount},${stat.dislikeCount},${stat.responseCount}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stats.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
