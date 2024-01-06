# Dockerfile
 
# Use an existing node alpine image as a base image.
FROM node:latest
 
# Set the working directory.
WORKDIR /app
 
# Copy the package.json file.
COPY package.json package-lock.json ./
# Install application dependencies.

RUN npm ci

# Copy the rest of the application files.
COPY . .

# Expose the port.
EXPOSE 5173
 
ENV PATH /app/node_modules/.bin:$PATH
# Run the application.
CMD npm run dev