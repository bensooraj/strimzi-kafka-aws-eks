# Remove all exited containers
docker rm $(docker ps -a -f status=exited -q)

# Build the Node.JS Kafka Test Producer
docker build -t nodejs-strimzi-kafka-test-producer:v1 .

# Build the Node.js Kafka Test Consumer
docker build -t nodejs-strimzi-kafka-test-consumer:v1 .

# Restart one Docker service by updating the image
docker-compose -f docker-compose/docker-compose.yml up -d --no-deps nodejs-consumer-service

# Kafka clients configmap
kubectl create configmap kafka-client-config --from-literal=KAFKA_BROKER_1=kafka-cluster-kafka-0.kafka-cluster-kafka-brokers --from-literal=KAFKA_BROKER_2=kafka-cluster-kafka-1.kafka-cluster-kafka-brokers --from-literal=KAFKA_BROKER_3=kafka-cluster-kafka-2.kafka-cluster-kafka-brokers --dry-run -o yaml > config.yaml

# Producer deployment
kubectl create deployment node-test-producer --image=bensooraj/nodejs-strimzi-kafka-test-producer:b3 --dry-run -o yaml > producer.Deployment.yaml

# Producer service
kubectl expose deployment node-test-producer --dry-run --type=LoadBalancer --port=80 --target-port=3000 -o yaml > producer.Service.yaml

# Producer deployment
kubectl create deployment node-test-consumer --image=bensooraj/nodejs-strimzi-kafka-test-consumer:b3 --dry-run -o yaml > consumer.Deployment.yaml

