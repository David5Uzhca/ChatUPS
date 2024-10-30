import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit {
  userName: string = '';
  private socket: Socket;
  messages: { user: string, text: string }[] = [];
  newMessage = '';

  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;

  constructor() {
    this.socket = io('http://localhost:3000');

    this.socket.on('message', (message: { user: string, text: string }) => {
      this.messages.push(message);
      this.scrollToBottom();
    });
  }

  ngOnInit(): void {
    this.userName = prompt("Please enter your name:", "User1") || "User1";
  }
/*
  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = { user: 'User1', text: this.newMessage };
      this.socket.emit('message', message);
      this.newMessage = '';
    }
  }
*/
  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.socket.emit('message', { user: this.userName, text: this.newMessage });
      this.newMessage = '';
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }
}
