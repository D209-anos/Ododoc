FROM gradle:8.7-jdk21 as builder
WORKDIR /app
COPY build.gradle settings.gradle /app/
COPY src /app/src
# RUN gradle build -x test --parallel --continue
RUN chmod +x ./gradlew && \ 
    ./gradlew clean build
RUN ls -la /app/build/libs/  # 확인 용도

FROM openjdk:21-jdk-slim
WORKDIR /app
ARG JASYPT_KEY
ENV JASYPT_KEY=$JASYPT_KEY
COPY --from=builder /app/build/libs/ododoc-0.0.1-SNAPSHOT.jar /app/ododoc.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-DJASYPT_KEY=${JASYPT_KEY}", "-Duser.timezone=Asia/Seoul", "-jar", "/app/ododoc.jar"]
