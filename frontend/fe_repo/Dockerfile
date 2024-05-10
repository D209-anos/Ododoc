
# 첫 번째 스테이지: 빌드 환경
FROM node:20.12.2 as builder
WORKDIR /app

# package.json 및 package-lock.json 파일 복사
COPY package*.json ./

# 모든 npm 의존성 설치
RUN npm install

# 패치 폴더 복사
COPY patches/ patches/

# 패치 적용
RUN npx patch-package

# 소스 코드 복사
COPY . .

# React 애플리케이션 빌드
RUN npm run build || exit 1

# 두 번째 스테이지: 실행 환경
FROM node:20.12.2
WORKDIR /app

# 빌드된 정적 파일 복사
COPY --from=builder /app/build /app/build

# serve 패키지를 전역으로 설치하여 React 애플리케이션을 제공
RUN npm install -g serve

# 3000 포트 노출
EXPOSE 3000

# serve를 사용하여 애플리케이션 서빙
ENTRYPOINT ["serve", "-s", "build", "-l", "3000"]
