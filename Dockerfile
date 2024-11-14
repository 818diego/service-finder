# Usar una imagen base de Node.js
FROM node:21

# Crear un directorio de trabajo
WORKDIR /app

# Copiar los archivos de backend y frontend
COPY services-finder-backend /app/backend
COPY services-finder-frontend /app/frontend

# Instalar dependencias del backend
WORKDIR /app/backend
RUN npm install

# Instalar dependencias del frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build  # Si es necesario compilar el frontend para producción

# Exponer los puertos necesarios
EXPOSE 3000  # Puerto del backend
EXPOSE 5173  # Puerto del frontend

# Comando para iniciar ambos servicios
WORKDIR /app
CMD ["sh", "-c", "node backend/server.js & serve -s frontend/build -l 5173"]
