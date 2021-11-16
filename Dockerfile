FROM node:14 AS base

FROM base AS build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM base AS deps
COPY package*.json ./
RUN npm install --only=production

FROM gcr.io/distroless/nodejs:14
WORKDIR /app
COPY --from=build dist .
COPY --from=deps node_modules node_modules
COPY public .

EXPOSE 3000

CMD ["index.js"]