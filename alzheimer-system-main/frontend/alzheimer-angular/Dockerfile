FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
COPY nginx-docker.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/assistance-quotidienne/browser /usr/share/nginx/html
EXPOSE 80
