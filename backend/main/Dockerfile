# FROM gradle:8.7-jdk21 as builder
# WORKDIR /app
# COPY build.gradle settings.gradle /app/
# COPY src /app/src
# RUN gradle build -x test --parallel --continue
# RUN ls -la /app/build/libs/  # 확인 용도

# FROM openjdk:21-jdk-slim
# WORKDIR /app
# ENV TZ=Asia/Seoul
# RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# COPY --from=builder /app/build/libs/ododoc-0.0.1-SNAPSHOT.jar /app/ododoc.jar
# EXPOSE 8080
# ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/ododoc.jar"]


FROM openjdk:21

ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ARG JAR_FILE=build/libs/ododoc-0.0.1-SNAPSHOT.jar
ARG JASYPT_KEY

ENV JASYPT_KEY=$JASYPT_KEY

COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-DJASYPT_KEY=${JASYPT_KEY}", "-Duser.timezone=Asia/Seoul", "-jar", "app.jar"]