# Stage 1: Builder
FROM node:22-alpine AS builder

ARG BUILD_VERSION
ARG BUILD_REF
ARG BUILD_SHA
ARG BUILD_DATE

ENV BUILD_REF=${BUILD_REF}
ENV BUILD_VERSION=${BUILD_VERSION}
ENV BUILD_SHA=${BUILD_SHA}
ENV BUILD_DATE=${BUILD_DATE}
# Set the working directory inside the builder
WORKDIR /glucose-monitor

# Copy the entire project into the builder
COPY . .

ENV NODE_ENV=development

# Run the build script
RUN npm install -g npm@11.3.0 \
  && npm install \
  && node app-build.js --install --clean

# Stage 2: Final container
FROM builder

ENV NODE_ENV=production

# Set the working directory inside the final container
WORKDIR /app

# Copy only the generated `app` directory from the builder stage
COPY --from=builder /glucose-monitor/app /app

# Copy all files if any exist
COPY files/certificates/ /tmp/ca-certificates/

# Append all .pem files to the system CA bundle if any exist
RUN set -e; \
    apk --no-cache add ca-certificates curl; \
    if ls /tmp/ca-certificates/*.pem 1> /dev/null 2>&1; then \
      echo "Adding custom CA certificates..."; \
      mkdir -p /etc/ssl/certs; \
      mkdir -p /usr/local/share/ca-certificates; \
      cat /tmp/ca-certificates/*.pem >> /etc/ssl/certs/ca-certificates.crt; \
      cp /tmp/ca-certificates/*.pem /usr/local/share/ca-certificates/; \
    fi; \
    update-ca-certificates; \
    npm install --omit=dev; \
    rm -rf /var/cache/apk/*


# Expose the port your app runs on (default example: 3000)
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail --silent http://localhost:3000/healthz || exit 1

# Start the application
CMD ["node", "www.js"]