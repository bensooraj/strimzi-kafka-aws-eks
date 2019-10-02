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
router.get('/kafka-test/cyan/:message', function (req, res, next) {

    kafkaProduceMessage(process.env.KAFKA_TOPIC_NAME, {
        type: 'TEST',
        action: 'PAINT_MESSAGE_CYAN',
        params: {
            message: req.params['message']
        }
    }, (error, data) => {

        if (error) {
            return res.json({
                message: req.params['message'],
                error
            });
        }

        res.json({
            message: req.params['message'],
            data
        });
    });

});

/* GET Test Kafka Message Production. */
router.get('/kafka-test/green/:message', function (req, res, next) {

    console.log("process.env.KAFKA_TOPIC_NAME: ", process.env.KAFKA_TOPIC_NAME)

    kafkaProduceMessage(process.env.KAFKA_TOPIC_NAME, {
        type: 'TEST',
        action: 'PAINT_MESSAGE_GREEN',
        params: {
            message: req.params['message']
        }
    }, (error, data) => {

        if (error) {
            return res.json({
                message: req.params['message'],
                error
            });
        }

        res.json({
            message: req.params['message'],
            data
        });
    });

});

/* GET Test Kafka Message Production. */
router.get('/kafka-test/blue/:message', function (req, res, next) {

    kafkaProduceMessage(process.env.KAFKA_TOPIC_NAME, {
        type: 'TEST',
        action: 'PAINT_MESSAGE_BLUE',
        params: {
            message: req.params['message']
        }
    }, (error, data) => {

        if (error) {
            return res.json({
                message: req.params['message'],
                error
            });
        }

        res.json({
            message: req.params['message'],
            data
        });
    });

});

/* GET Test Kafka Message Production. */
router.get('/kafka-test/uppercase/:message', function (req, res, next) {

    kafkaProduceMessage('s3-upload-topic', {
        type: 'TEST',
        action: 'TRANSFORM_MESSAGE_UPPERCASE',
        params: {
            message: req.params['message']
        }
    }, (error, data) => {

        if (error) {
            return res.json({
                message: req.params['message'],
                error
            });
        }

        res.json({
            message: req.params['message'],
            data
        });
    });

});

module.exports = router;
