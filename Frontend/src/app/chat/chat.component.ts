import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ChatService } from '../services/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  userInput = '';
  isLoading = false;
  isChatOpen = false;
  unreadMessages = 0;

  messages: { user: boolean, content: string }[] = [
    { user: false, content: "Hello! I'm your business assistant. How can I help you today?" }
  ];

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(private chatService: ChatService) {}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.unreadMessages = 0;
      this.scrollToBottom();
    }
  }

  sendMessage() {
    const trimmed = this.userInput.trim();
    if (!trimmed) return;

    // Add user message
    this.messages.push({ user: true, content: trimmed });
    this.userInput = '';
    this.isLoading = true;
    this.scrollToBottom();

    if (!this.isChatOpen) {
      this.unreadMessages++;
    }

    this.chatService.sendMessage(trimmed).subscribe(
      response => {
        this.messages.push({ user: false, content: response });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error => {
        this.messages.push({ user: false, content: '⚠️ Error. Try again later.' });
        this.isLoading = false;
        this.scrollToBottom();
      }
    );
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.isChatOpen) {
      this.isChatOpen = false;
    }
  }
}