import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.scss']
})
export class SendMailComponent {
  email = {
    to: '',
    subject: '',
    body: ''
  };

  selectedFile: File | null = null;
  responseMessage: string = '';
  sending: boolean = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  sendEmail() {
    this.sending = true;
    const formData = new FormData();
    formData.append('to', this.email.to);
    formData.append('subject', this.email.subject);
    formData.append('body', this.email.body);

    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile);
    }

    this.http.post('http://localhost:8080/api/mailjet/send', formData, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          this.responseMessage = res;
          this.sending = false;
        },
        error: (err) => {
          this.responseMessage = 'Erreur : ' + err.error;
          this.sending = false;
        }
      });
  }
}
