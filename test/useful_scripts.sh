# Remove all exited containers
docker rm $(docker ps -a -f status=exited -q)

# Build the Node.JS Kafka Test Producer
docker build -t nodejs-strimzi-kafka-test-producer:v1 .

# Build the Node.js Kafka Consumer Image
docker build -t nodejs-kafka-consumer-app:v1 .

# Restart one Docker service by updating the image
docker-compose -f docker-compose/docker-compose.yml up -d --no-deps nodejs-consumer-service