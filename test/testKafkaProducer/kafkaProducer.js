const kafka = require('kafka-node'),

    HighLevelProducer = kafka.HighLevelProducer,

    client = new kafka.KafkaClient({
        // A string of kafka broker/host combination delimited by comma
        kafkaHost: `${process.env.KAFKA_BROKER_1}:9092`, // BROKER_HOST
        // ms it takes to wait for a successful connection before moving to the next host default: 10000
        connectTimeout: "10000", // BROKER_CONNECT_TIMEOUT
        // ms for a kafka request to timeout default: 30000
        requestTimeout: "60000", // BROKER_REQUEST_TIMEOUT
        // automatically connect when KafkaClient is instantiated otherwise you need to manually call connect default: true
        autoConnect: true, // BROKER_AUTO_CONNECT
        // maximum async operations at a time toward the kafka cluster. default: 10
        maxAsyncRequests: 10, // BROKER_MAX_ASYNC_REQUESTS
    }),

    producer = new HighLevelProducer(client, {
        // Configuration for when to consider a message as acknowledged, default 1
        requireAcks: 1, // PRODUCER_REQUIRE_ACKS
        // The amount of time in milliseconds to wait for all acks before considered, default 100ms
        ackTimeoutMs: 100, // PRODUCER_ACKS_TIMEOUT
        // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
        partitionerType: 2, // PRODUCER_PARTITONER_TYPE
    });

producer.on('ready', function () {
    console.log("Kafka HighLevelProducer is ready!");
});

producer.on('error', function (err) {
    console.log("Kafka HighLevelProducer Error: ", err);
});

module.exports = {
    kafkaProducer: producer,
    kafkaProduceMessage: (topic, messages, cb) => {
        producer.send([{
            topic,
            messages: JSON.stringify(messages)
        }], cb);
    }
}