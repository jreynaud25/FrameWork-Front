# Dockerfile
 
# Use an existing node alpine image as a base image.
FROM node:latest
 
# Set the working directory.
WORKDIR /app
 
# Copy the package.json file.
COPY package.json .
 
# Install application dependencies.
RUN npm ci

# Copy the rest of the application files.
COPY . .
 
# Expose the port.
EXPOSE 3000
 
# Run the application.
CMD npm run dev