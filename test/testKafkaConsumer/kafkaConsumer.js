require('dotenv').config()

const { Kafka } = require('kafkajs');
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [`${process.env.KAFKA_BROKER_1}:9092`, `${process.env.KAFKA_BROKER_2}:9092`, `${process.env.KAFKA_BROKER_3}:9092`]
});

const topic = process.env.KAFKA_TOPIC_NAME;
const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic })
    await consumer.run({
        // eachBatch: async ({ batch }) => {
        //   console.log(batch)
        // },
        eachMessage: async ({ topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            console.log(`- ${prefix} ${message.key}#${message.value}`)
        },
    })
}

run().catch(e => console.error(`[example/consumer] ${e.message}`, e));

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
    process.on(type, async e => {
        try {
            console.log(`process.on ${type}`)
            console.error(e)
            await consumer.disconnect()
            process.exit(0)
        } catch (_) {
            process.exit(1)
        }
    })
})

signalTraps.map(type => {
    process.once(type, async () => {
        try {
            await consumer.disconnect()
        } finally {
            process.kill(process.pid, type)
        }
    })
})
// const kafkaLogging = require('kafka-node/logging');
// kafkaLogging.setLoggerProvider(() => {
//     return {
//         debug: console.debug.bind(console),
//         info: console.info.bind(console),
//         warn: console.warn.bind(console),
//         error: console.error.bind(console)
//     };
// });

// const messageHandler = require("./kafkaMessageHandler");
// const brokerConnection = `${process.env.KAFKA_BROKER_1}:9092,${process.env.KAFKA_BROKER_2}:9092,${process.env.KAFKA_BROKER_3}:9092`;
// console.log("brokerConnection: ", brokerConnection);

// const kafka = require('kafka-node'),

//     ConsumerGroup = kafka.ConsumerGroup,

//     consumerGroupOptions = {
//         kafkaHost: brokerConnection, // connect directly to kafka broker (instantiates a KafkaClient)
//         // batch: undefined, // put client batch settings if you need them
//         // ssl: true, // optional (defaults to false) or tls options hash
//         groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
//         sessionTimeout: 15000,
//         // An array of partition assignment protocols ordered by preference.
//         // 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
//         protocol: ['roundrobin'],
//         encoding: 'utf8', // default is utf8, use 'buffer' for binary data

//         fetchMaxBytes: 10 * 1024 * 1024, // 10 MB

//         // Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
//         // equivalent to Java client's auto.offset.reset
//         fromOffset: 'latest', // default
//         // commitOffsetsOnFirstJoin: true, // on the very first time this consumer group subscribes to a topic, record the offset returned in fromOffset (latest/earliest)
//         // how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
//         outOfRangeOffset: 'earliest', // default
//         autoCommit: true,
//         autoCommitIntervalMs: 5000
//         // Callback to allow consumers with autoCommit false a chance to commit before a rebalance finishes
//         // isAlreadyMember will be false on the first connection, and true on rebalances triggered after that
//         // onRebalance: (isAlreadyMember, callback) => { callback(); } // or null
//     },

//     consumerGroup = new ConsumerGroup(consumerGroupOptions, process.env.KAFKA_TOPIC_NAME);

// consumerGroup.on('connect', () => {
//     console.log("Kafka Consumer Group Connected");
// });

// consumerGroup.on('error', (error) => {
//     console.log("Kafka Consumer Group Error: ", error);
// });

// consumerGroup.on('rebalancing', () => {
//     console.log("Kafka Consumer Group Rebalancing");
// });

// consumerGroup.on('rebalanced', () => {
//     console.log("Kafka Consumer Group Rebalanced");
// });

// consumerGroup.on('message', async (message) => {
//     // console.log("Message Received: ", message);

//     const messageValue = JSON.parse(message.value);
//     try {
//         await messageHandler(messageValue.type, messageValue.action, messageValue.params);
//     } catch (error) {
//         console.log("[Kafka Message Processing] Error: ", error);
//     }
// });
