# Usar una imagen base de Node.js
FROM node:18

# Instalar Git para clonar el repositorio
RUN apt-get update && apt-get install -y git

# Crear un directorio de trabajo
WORKDIR /app

# Clonar el repositorio
RUN git clone https://github.com/818diego/service-finder.git .

# Instalar dependencias del backend
WORKDIR /app/services-finder-backend
RUN npm install

# Instalar dependencias del frontend
WORKDIR /app/services-finder-frontend
RUN npm install
RUN npm run build  # Si es necesario compilar el frontend para producción

# Instalar 'serve' globalmente para servir el frontend
RUN npm install -g serve

# Exponer los puertos necesarios
EXPOSE 3000  # Puerto del backend
EXPOSE 5173  # Puerto del frontend

# Comando para iniciar ambos servicios
WORKDIR /app
CMD ["sh", "-c", "node services-finder-backend/server.js & serve -s services-finder-frontend/build -l 5173"]
