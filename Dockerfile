# Steg 1: bygg appen med Node
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Steg 2: servera de statiska filerna med nginx – bara det här blir imagen
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# Vilken commit är det här? Pipelinen skickar in sha:n.
ARG GIT_SHA=lokal
RUN echo "$GIT_SHA" > /usr/share/nginx/html/version.txt
ENV PORT=80
EXPOSE 80