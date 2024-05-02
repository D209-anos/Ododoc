FROM openjdk:21

ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ARG JAR_FILE=build/libs/ododoc-0.0.1-SNAPSHOT.jar
ARG JASYPT_KEY

ENV JASYPT_KEY=$JASYPT_KEY

COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-DJASYPT_KEY=${JASYPT_KEY}", "-Duser.timezone=Asia/Seoul", "-jar", "app.jar"]