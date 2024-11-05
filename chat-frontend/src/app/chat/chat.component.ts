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
  userName: string = ''; // Almacena el nombre del usuario
  private socket: Socket; // Inicializa la conexión del socket
  messages: { user: string, text: string }[] = []; // Arreglo para almacenar mensajes
  newMessage = ''; // Mensaje nuevo a enviar

  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef; // Referencia al contenedor de mensajes

  constructor() {
    // Establecer conexión con el servidor de Socket.IO
    this.socket = io('http://localhost:3000');

    // Escuchar el evento 'message' para recibir mensajes
    this.socket.on('message', (message: { user: string, text: string }) => {
      this.messages.push(message); // Agregar el mensaje recibido al arreglo de mensajes
      this.scrollToBottom(); // Desplazar la vista hacia abajo para mostrar el último mensaje
    });
  }

  
  ngOnInit(): void {
    // Solicitar al usuario su nombre
    this.userName = prompt("Please enter your name:", "User1") || "User1"; // Asigna un nombre por defecto si no se proporciona
  }

  /*
  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = { user: 'User1', text: this.newMessage }; // Mensaje con un nombre fijo (descomentado en el código original)
      this.socket.emit('message', message); // Emitir el mensaje al servidor
      this.newMessage = ''; // Limpiar el campo del nuevo mensaje
    }
  }
  */

  // Método para enviar un nuevo mensaje
  sendMessage(): void {
    if (this.newMessage.trim()) { // Verificar que el mensaje no esté vacío
      // Emitir el mensaje con el nombre del usuario y el texto del nuevo mensaje
      this.socket.emit('message', { user: this.userName, text: this.newMessage });
      this.newMessage = ''; // Limpiar el campo del nuevo mensaje
    }
  }

  // Método para desplazarse hacia la parte inferior del contenedor de mensajes
  scrollToBottom(): void {
    setTimeout(() => { // Usar setTimeout para asegurarse de que el DOM esté actualizado
      if (this.messagesContainer) {
        // Ajustar el desplazamiento del contenedor para mostrar el último mensaje
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }
}
