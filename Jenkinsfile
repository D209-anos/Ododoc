pipeline {
    agent any
    stages {
        stage("Clone Repository") {
            steps {
                echo '클론 시작'
                git branch: 'master', credentialsId: 'ododoc', url: 'https://lab.ssafy.com/s10-final/S10P31D209.git'
                echo '클론 끝'
            }
        }
    }
}

pipeline {
    agent any
    stages {
        stage("Update jasypt.properties") {
            steps {
                withCredentials([string(credentialsId: 'jasypt-key', variable: 'JASYPT_KEY')]) {
                    script {
                        // jasypt.properties 파일의 위치로 이동
                        dir('./backend/main/src/main/resources') {
                            // sed 명령을 사용해 jasypt.key 값을 파일에 삽입
                            sh "sed -i 's/jasypt.key = .*/jasypt.key = ${JASYPT_KEY}/' jasypt.properties"
                        }
                    }
                }
            }
        }

        stage("Build BE Docker Image") {
            steps {
                echo '백엔드 도커 이미지 빌드 시작!'
                dir("./backend/main") {  // Dockerfile이 있는 백엔드 프로젝트 위치
                    sh "docker build -t d209-be ."
                }
                echo '백엔드 도커 이미지 빌드 완료!'
            }
        }

        stage("Deploy to EC2-BE") {
            steps {
                echo '백엔드 EC2에 배포 시작!'
                sh "docker run -d -p 8080:8080 --name backend d209-be"
                echo '백엔드 EC2에 배포 완료!'
            }
        }
    }
}

pipeline {
    agent any
    stages {
        stage("Build FE Docker Image") {
            steps {
                echo '프론트 도커 이미지 빌드 시작!'
                dir("./frontend/fe_repo") {  // Dockerfile이 있는 프론트엔드 프로젝트 위치
                    sh "docker build -t d209-fe ."
                }
                echo '프론트 도커 이미지 빌드 완료!'
            }
        }
    }
}

pipeline {
    agent any
    stages {
        stage('Deploy to EC2-FE') {
            steps {
                echo '프론트 EC2에 배포 시작!'
                sh "docker run -d -p 3000:3000 --name frontend d209-fe"
                echo '프론트 EC2에 배포 완료!'
            }
        }
    }
}
