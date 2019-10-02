require('dotenv').config()

const messageHandler = require("./kafkaMessageHandler");

const kafka = require('kafka-node'),

    ConsumerGroup = kafka.ConsumerGroup,

    consumerGroupOptions = {
        kafkaHost: `${process.env.KAFKA_BROKER_1}:9092`, // connect directly to kafka broker (instantiates a KafkaClient)
        batch: undefined, // put client batch settings if you need them
        ssl: true, // optional (defaults to false) or tls options hash
        groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
        sessionTimeout: 15000,
        // An array of partition assignment protocols ordered by preference.
        // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
        protocol: ['roundrobin'],
        encoding: 'utf8', // default is utf8, use 'buffer' for binary data

        // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
        // equivalent to Java client's auto.offset.reset
        fromOffset: 'latest', // default
        commitOffsetsOnFirstJoin: true, // on the very first time this consumer group subscribes to a topic, record the offset returned in fromOffset (latest/earliest)
        // how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
        outOfRangeOffset: 'earliest', // default
        // Callback to allow consumers with autoCommit false a chance to commit before a rebalance finishes
        // isAlreadyMember will be false on the first connection, and true on rebalances triggered after that
        onRebalance: (isAlreadyMember, callback) => { callback(); } // or null
    },

    consumerGroup = new ConsumerGroup(consumerGroupOptions, process.env.KAFKA_TOPIC_NAME);

consumerGroup.on('connect', () => {
    console.log("Kafka Consumer Group Connected");
});

consumerGroup.on('error', (error) => {
    console.log("Kafka Consumer Group Error: ", error);
});

consumerGroup.on('rebalancing', () => {
    console.log("Kafka Consumer Group Rebalancing");
});

consumerGroup.on('rebalanced', () => {
    console.log("Kafka Consumer Group Rebalanced");
});

consumerGroup.on('message', async (message) => {
    // console.log("Message Received: ", message);

    const messageValue = JSON.parse(message.value);
    try {
        await messageHandler(messageValue.type, messageValue.action, messageValue.params);
    } catch (error) {
        console.log("[Kafka Message Processing] Error: ", error);
    }
});
