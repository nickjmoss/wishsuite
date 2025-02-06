# node:18.13.0-bullseye
FROM node@sha256:d9061fd0205c20cd47f70bdc879a7a84fb472b822d3ad3158aeef40698d2ce36 as builder

WORKDIR /app

# Install all dependencies
COPY package.json *yarn* ./
RUN yarn install --frozen-lockfile

COPY . .

# Build the client bundle
RUN yarn run build

# Remove all dev dependencies (frontend packages no longer needed after build)
RUN yarn install --production --frozen-lockfile

# Delete nested yarn.lock files from our dependencies, since they aren't needed or used,
# but vulnerability scanners tend to find them and complain about their contents
RUN find /app/node_modules -name yarn.lock -type f -exec rm {} +


# node:18.13.0-bullseye
FROM node@sha256:d9061fd0205c20cd47f70bdc879a7a84fb472b822d3ad3158aeef40698d2ce36 AS minimal
WORKDIR /app
# Add basic utilities to the image for debugging
RUN apt-get update && apt-get install -y bash curl vim
# Add pm2
RUN npm install pm2 -g
# Copy over all files from builder
COPY --from=builder /app /app

EXPOSE 4000

CMD [ "yarn", "run", "start:prod" ]
