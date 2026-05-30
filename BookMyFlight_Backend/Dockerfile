# Étape 1 : Build avec Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean install -DskipTests

# Étape 2 : Lancer l'application
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/BookMyFlight-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8980
ENTRYPOINT ["java", "-jar", "app.jar"]