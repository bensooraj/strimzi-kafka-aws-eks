if (
    process.env.MODE === "dev"
) {
    require('dotenv').config({
        path: '../../test/.env'
    })
}
const { Kafka } = require('kafkajs');
const kafka = new Kafka({
    clientId: 'strimzi-node-consumer',
    brokers: [`${process.env.KAFKA_BROKER_1}:9094`, `${process.env.KAFKA_BROKER_2}:9094`, `${process.env.KAFKA_BROKER_3}:9094`],
    authenticationTimeout: 10000,
    connectionTimeout: 10000,
    sasl: {
        mechanism: 'scram-sha-256',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
    },
    ssl: true
});
const topic = process.env.KAFKA_TOPIC_NAME;
const consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP_ID });

const messageHandler = require("./kafkaMessageHandler");

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic })
    await consumer.run({
        // eachBatch: async ({ batch }) => {
        //   console.log(batch)
        // },
        eachMessage: async ({ topic, partition, message }) => {
            // const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            // console.log(`- ${prefix} ${message.key}#${message.value}`)

            const messageValue = JSON.parse(message.value);
            try {
                await messageHandler(messageValue.type, messageValue.action, messageValue.params);
            } catch (error) {
                console.log("[Kafka Message Processing] Error: ", error);
            }
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
