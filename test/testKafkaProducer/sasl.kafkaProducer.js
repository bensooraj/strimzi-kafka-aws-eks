if (
    process.env.MODE === "dev"
) {
    require('dotenv').config({
        path: '../../test/.env'
    })
}
const { Kafka, CompressionTypes } = require('kafkajs');
const kafka = new Kafka({
    clientId: 'strimzi-node-producer',
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

const producer = kafka.producer()

const run = async () => {
    await producer.connect()
    // setInterval(sendMessage, 3000)
}

run().catch(e => console.error(`[example/producer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
    process.on(type, async () => {
        try {
            console.log(`process.on ${type}`)
            await producer.disconnect()
            process.exit(0)
        } catch (_) {
            process.exit(1)
        }
    })
})

signalTraps.map(type => {
    process.once(type, async () => {
        try {
            await producer.disconnect()
        } finally {
            process.kill(process.pid, type)
        }
    })
})



module.exports = {
    kafkaProducer: producer,
    kafkaProduceMessage: async (topic, messages) => {
        try {
            const recordMetadata = await producer.send({
                topic,
                compression: CompressionTypes.GZIP,
                messages: [
                    { value: JSON.stringify(messages) }
                ],
            });
            return recordMetadata;
        } catch (error) {
            console.log("Error producing Kafka message: ", error);
            // throw new Error(error);
        }
    }
}