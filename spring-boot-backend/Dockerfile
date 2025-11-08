FROM eclipse-temurin:21-jdk as builder
WORKDIR /app
COPY . .
RUN ./gradlew bootJar

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/build/libs/app-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]