# Stage 1: Build the jar using the repo's Maven wrapper (mvnw)
FROM maven:3.9.4-eclipse-temurin-17 AS build

WORKDIR /app

# Copy only what we need for dependency resolution first (improves cache)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Copy source and build
COPY src ./src
RUN ./mvnw -B clean package -DskipTests

# Stage 2: runtime image
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy built jar (wildcard so we don't need exact version)
COPY --from=build /app/target/*.jar app.jar

# Expose default port (Render provides PORT env var)
EXPOSE 8080

# Start the app, honor Render's PORT env var (fallback to 8080)
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
