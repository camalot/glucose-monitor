# Use the latest Node.js version with Alpine
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY ./app/package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the ./app directory to /app in the container
COPY ./app /app

# Expose the port your app runs on (default example: 3000)
EXPOSE 3000

# Start the application
CMD ["node", "www.js"]