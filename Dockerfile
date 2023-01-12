FROM node:16.16-bullseye

WORKDIR /app

COPY package.json yarn.lock* .npmrc ./
RUN yarn install --frozen-lockfile

COPY . .
