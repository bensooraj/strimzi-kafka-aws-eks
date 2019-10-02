FROM node:12.10

WORKDIR /app
COPY package.json /app
RUN npm install

COPY . /app

CMD ["node", "kafkaConsumer.js"]
