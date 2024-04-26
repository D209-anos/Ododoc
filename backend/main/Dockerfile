FROM gradle:8.7-jdk21 as builder
WORKDIR /app

COPY build.gradle settings.gradle /app/
COPY src /app/src

RUN gradle build -x test --parallel --continue
RUN ls -la /app/build/libs/

FROM openjdk:21-jdk-slim

COPY --from=builder /app/ododoc-0.0.1-SNAPSHOT.jar /app/ododoc.jar

EXPOSE 8080

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app/ododoc.jar"]