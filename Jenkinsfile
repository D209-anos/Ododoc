pipeline {
    agent any

    environment {
        JAVA_HOME = '/usr/local/jdk-21.0.2'
        PATH = "${env.JAVA_HOME}/bin:${env.PATH}"
    }

    stages {
        stage("Clone Repository") {
            steps {
                echo '클론 시작'
                git branch: 'master', credentialsId: 'ododoc', url: 'https://lab.ssafy.com/s10-final/S10P31D209.git'
                echo '클론 끝'
            }
        }

        stage("Update jasypt.properties") {
            steps {
                withCredentials([string(credentialsId: 'jasypt-key', variable: 'JASYPT_KEY')]) {
                    script {
                        // jasypt.properties 파일의 위치로 이동
                        dir('./backend/main/src/main/resources') {
                            // sed 명령을 사용해 jasypt.key 값을 파일에 삽입
                            sh "sed -i 's/jasypt.key = .*/jasypt.key = ${JASYPT_KEY}/' jasypt.properties"
                        }
                        dir('./backend/process/src/main/resources') {
                            // sed 명령을 사용해 jasypt.key 값을 파일에 삽입
                            sh "sed -i 's/jasypt.key = .*/jasypt.key = ${JASYPT_KEY}/' jasypt.properties"
                        }
                    }
                }
            }
        }

        stage("Build BE Docker Image") {
            steps {
                withEnv(["JAVA_HOME=${JAVA_HOME}", "PATH=${JAVA_HOME}/bin:${PATH}"]) {
                    withCredentials([string(credentialsId: 'jasypt-key', variable: 'JASYPT_KEY')]) {
                        echo '백엔드 도커 이미지 빌드 시작!'
                        dir("./backend/main") {  // Dockerfile이 있는 백엔드 프로젝트 위치
                            sh 'chmod +x ./gradlew'
                            sh './gradlew clean build'
                            sh "docker build --build-arg JASYPT_KEY=${JASYPT_KEY} -t d209-be ."
                        }
                        echo '백엔드 도커 이미지 빌드 완료!'
                    }
            
                }
            }
        }

        stage("Deploy to EC2-BE") {
            steps {
                echo '백엔드 EC2에 배포 시작!'
                // 기존 컨테이너 중지 및 제거
                sh 'docker rm -f d209-be || true'
                sh 'docker rm -f backend || true'
                sh "docker run -d -p 8080:8080 --name backend d209-be"
                echo '백엔드 EC2에 배포 완료!'
            }
        }

        stage("Build Process Docker Image") {
            steps {
                
                echo '처리 서버 도커 이미지 빌드 시작!'
                dir("./backend/process") {  // Dockerfile이 있는 백엔드 프로젝트 위치
                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean build'
                    sh "docker build -t d209-pro ."
                }
                echo '처리 서버 도커 이미지 빌드 완료!'
            
            }
        }

        stage("Deploy to EC2-Process") {
            steps {
                echo '처리 서버 EC2에 배포 시작!'
                // 기존 컨테이너 중지 및 제거
                sh 'docker rm -f d209-pro || true'
                sh 'docker rm -f process || true'
                sh "docker run -d -p 18080:18080 --name process d209-pro"
                echo '처리 서버 EC2에 배포 완료!'
            }
        }

        stage("Prepare FE Environment") {
            steps {
                echo '프론트엔드 환경 설정 시작!'
                withCredentials([file(credentialsId: 'ododoc-front-env', variable: 'ENV_FILE')]) {
                    dir("./frontend/fe_repo") {
                        sh "cp ${ENV_FILE} ./.env"
                    }
                }
                echo '프론트엔드 환경 설정 완료!'
            }
        }

        stage("Build FE Docker Image") {
            steps {
                echo '프론트 도커 이미지 빌드 시작!'
                dir("./frontend/fe_repo") {  // Dockerfile이 있는 프론트엔드 프로젝트 위치
                    sh "docker build -t d209-fe ."
                }
                echo '프론트 도커 이미지 빌드 완료!'
            }
        }

        stage('Deploy to EC2-FE') {
            steps {
                echo '프론트 EC2에 배포 시작!'
                sh 'docker rm -f d209-fe || true'
                sh 'docker rm -f frontend || true'
                sh "docker run -d -p 3000:3000 --name frontend d209-fe"
                echo '프론트 EC2에 배포 완료!'
            }
        }
    }
}
