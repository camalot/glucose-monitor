# Stage 1: Builder
FROM node:23-alpine AS builder

# Set the working directory inside the builder
WORKDIR /glucose-monitor

# Copy the entire project into the builder
COPY . .

ENV NODE_ENV=development

# Run the build script
RUN npm install -g npm@11.3.0 \
  && npm install -g --only=dev \
  && npm install -g typescript \
  && npm install -g copyfiles \
  && node app-build.js

# Stage 2: Final container
FROM builder

ENV NODE_ENV=production

# Set the working directory inside the final container
WORKDIR /app

# Copy only the generated `app` directory from the builder stage
COPY --from=builder /glucose-monitor/app /app

# Install production dependencies
RUN npm install --omit=dev

# Expose the port your app runs on (default example: 3000)
EXPOSE 3000

# Start the application
CMD ["node", "www.js"]