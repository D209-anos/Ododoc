FROM gradle:8.7-jdk21 as builder
WORKDIR /app
COPY build.gradle settings.gradle /app/
COPY src /app/src
RUN gradle build -x test --parallel --continue
RUN ls -la /app/build/libs/  # 확인 용도

FROM openjdk:21-jdk-slim
WORKDIR /app
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update && apt-get install -y redis-server && \
    rm -rf /var/lib/apt/lists/* && \
    sed -i 's/^bind 127.0.0.1 -::1$/bind 0.0.0.0/' /etc/redis/redis.conf && \
    echo "daemonize no" >> /etc/redis/redis.conf
COPY --from=builder /app/build/libs/ododoc-0.0.1-SNAPSHOT.jar /app/ododoc.jar
EXPOSE 8080 6379
ENTRYPOINT redis-server /etc/redis/redis.conf && exec java -Djava.security.egd=file:/dev/./urandom -jar /app/ododoc.jar
# ENTRYPOINT ["java", "redis-server --daemonize yes && java -Djava.security.egd=file:/dev/./urandom", "-jar", "/app/ododoc.jar"]
