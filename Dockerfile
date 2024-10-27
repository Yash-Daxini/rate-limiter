FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

RUN yarn add typescript
COPY . .
RUN yarn tsc    