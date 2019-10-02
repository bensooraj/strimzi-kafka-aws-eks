FROM node:12.10 as base

WORKDIR /app

COPY package*.json /app/
COPY . /app

# Install app dependencies
RUN npm install --only=production

FROM node:12.10.0-slim as release
WORKDIR /app

# Source
COPY --from=base /app .

CMD ["node", "kafkaConsumer.js"]
