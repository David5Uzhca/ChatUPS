# Usa una imagen base de Node.js
FROM node:20.9.0

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia y configura el frontend
COPY ./chat-frontend ./chat-frontend
WORKDIR /app/chat-frontend

# Instala dependencias y construye el frontend
RUN npm install -g @angular/cli@17.3.11 && \
    npm install && \
    ng build --output-path=dist/chat-frontend || { echo 'ng build falló'; exit 1; }

# Configuración para el backend
WORKDIR /app/chat-backend
COPY ./chat-backend /app/chat-backend

# Verificar que server.js está en el directorio
RUN ls /app/chat-backend

# Instala las dependencias del backend
RUN npm install

# Copia los archivos compilados del frontend al backend para que se sirvan desde el mismo servidor
RUN mkdir -p public && cp -R /app/chat-frontend/dist/browser/* public/

# Exponer el puerto necesario
EXPOSE 3000

# Inicia el servidor Node.js
CMD ["node", "server.js"]
