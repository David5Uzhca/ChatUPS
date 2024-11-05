// Importar los módulos necesarios
const express = require('express'); // Framework para aplicaciones web
const http = require('http'); // Módulo nativo para crear servidores HTTP
const { Server } = require('socket.io'); // Importar Server de Socket.IO para la comunicación en tiempo real
const cors = require('cors'); // Middleware para habilitar CORS (Cross-Origin Resource Sharing)

// Crear una instancia de Express
const app = express();

// Crear un servidor HTTP utilizando la aplicación Express
const server = http.createServer(app);

// Configurar Socket.IO con CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200", // Permitir solicitudes solo desde este origen
    methods: ["GET", "POST"] // Métodos HTTP permitidos
  }
});

// Aplicar el middleware CORS
app.use(cors());

// Configurar el evento de conexión de Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado'); // Mensaje en la consola cuando un usuario se conecta

  // Manejar el evento de mensaje
  socket.on('message', (data) => {
    // Emitir el mensaje recibido a todos los usuarios conectados
    io.emit('message', { user: data.user, text: data.text });
  });

  // Manejar el evento de desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado'); // Mensaje en la consola cuando un usuario se desconecta
  });
});

// Definir el puerto en el que se escuchará el servidor
const PORT = 3000;

// Iniciar el servidor y mostrar un mensaje en la consola
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`); // Mensaje indicando que el servidor está en funcionamiento
});
