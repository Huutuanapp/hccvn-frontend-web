FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_BASE_URL
ARG VITE_ENV
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ENV=$VITE_ENV

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g http-server
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["http-server", "dist", "-p", "3000"]
