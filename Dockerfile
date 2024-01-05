# Dockerfile
 
# Use an existing node alpine image as a base image.
FROM node:latest
 
# Set the working directory.
WORKDIR /app
 
# Copy the package.json file.
COPY package.json .
# COPY package-lock.json .
# Install application dependencies.



# Copy the rest of the application files.
COPY . .
RUN npm install
# Expose the port.
EXPOSE 4321
 
ENV PATH /app/node_modules/.bin:$PATH
# Run the application.
CMD npm run dev