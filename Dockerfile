# Stage 1: Build the Ionic application
#FROM node:lts-alpine as build
FROM node:22-alpine AS build
# Set the working directory inside the container
WORKDIR /app
# Install Ionic CLI globally
RUN npm install -g @ionic/cli
# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install
# Copy the rest of the application code
COPY . .
# Build the Ionic application for production
RUN ionic build --prod
# Stage 2: Serve the built application with Nginx
FROM nginx:alpine
# Copy the built Ionic app from the 'build' stage to Nginx's web root
COPY --from=build /app/www /usr/share/nginx/html
# Copy the custom nginx.conf for solving issue with reload
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 (default for Nginx)
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]