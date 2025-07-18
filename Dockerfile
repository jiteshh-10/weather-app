# Use an official Java 17 JDK as base image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy all files to /app
COPY . /app

# Build the Spring Boot application (skip tests to speed up)
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Run the built JAR file
CMD ["java", "-jar", "target/weather-app-0.0.1-SNAPSHOT.jar"]
