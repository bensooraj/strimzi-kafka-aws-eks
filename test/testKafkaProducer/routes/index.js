const express = require('express');
const router = express.Router();
const { kafkaProduceMessage } = require('../kafkaProducer');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({
        message: "Home Page"
    });
});

/* GET Test Kafka Message Production. */
router.get('/kafka-test/cyan/:message', async function (req, res, next) {
    let recordMetadata = [];
    try {
        recordMetadata = await kafkaProduceMessage(process.env.KAFKA_TOPIC_NAME, {
            type: 'TEST',
            action: 'PAINT_MESSAGE_CYAN',
            params: {
                message: req.params['message']
            }
        });
    } catch (error) {
        console.log(`[ERROR] /kafka-test/cyan/${req.params['message']}: `, error);
        return res.json({
            message: req.params['message'],
            error
        });
    }
    res.json({
        message: req.params['message'],
        data: recordMetadata
    });
});

/* GET Test Kafka Message Production. */
router.get('/kafka-test/green/:message', async function (req, res, next) {
    let recordMetadata = [];
    try {
        recordMetadata = await kafkaProduceMessage(process.env.KAFKA_TOPIC_NAME, {
            type: 'TEST',
            action: 'PAINT_MESSAGE_GREEN',
            params: {
                message: req.params['message']
            }
        });
    } catch (error) {
        console.log(`[ERROR] /kafka-test/green/${req.params['message']}: `, error);
        return res.json({
            message: req.params['message'],
            error
        });
    }
    res.json({
        message: req.params['message'],
        data: recordMetadata
    });
});

/* GET Test Kafka Message Production. */
router.get('/kafka-test/blue/:message', async function (req, res, next) {
    let recordMetadata = [];
    try {
        recordMetadata = await kafkaProduceMessage(process.env.KAFKA_TOPIC_NAME, {
            type: 'TEST',
            action: 'PAINT_MESSAGE_BLUE',
            params: {
                message: req.params['message']
            }
        });
    } catch (error) {
        console.log(`[ERROR] /kafka-test/blue/${req.params['message']}: `, error);
        return res.json({
            message: req.params['message'],
            error
        });
    }
    res.json({
        message: req.params['message'],
        data: recordMetadata
    });
});

/* GET Test Kafka Message Production. */
router.get('/kafka-test/uppercase/:message', async function (req, res, next) {
    try {
        recordMetadata = await kafkaProduceMessage(process.env.KAFKA_TOPIC_NAME, {
            type: 'TEST',
            action: 'TRANSFORM_MESSAGE_UPPERCASE',
            params: {
                message: req.params['message']
            }
        });
    } catch (error) {
        console.log(`[ERROR] /kafka-test/uppercase/${req.params['message']}: `, error);
        return res.json({
            message: req.params['message'],
            error
        });
    }
    res.json({
        message: req.params['message'],
        data: recordMetadata
    });
});

module.exports = router;
