# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Install Gradle
RUN apk add --no-cache gradle

# Copy build configuration files first
COPY build.gradle.kts settings.gradle.kts gradle.properties ./

# Copy source code
COPY src ./src

# Debug: List files to see what was copied
RUN echo "=== Files in /app ===" && ls -la && \
    echo "=== Files in /app/src ===" && ls -la src/ || true

# Build application
RUN gradle bootJar --no-daemon -x test

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy jar from builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# JVM optimization flags
ENV JAVA_OPTS="-Djava.security.egd=file:/dev/./urandom \
    -XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:+UseG1GC \
    -XX:+UseStringDeduplication"

# Run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dspring.profiles.active=prod -jar app.jar"]