# Mock-API:t: bara Node + express, ingen build
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
# Installera produktionsberoenden utan att köra Husky
RUN npm ci --omit=dev --ignore-scripts
COPY mock-api ./mock-api
EXPOSE 4000
CMD ["node", "mock-api/server.js"]