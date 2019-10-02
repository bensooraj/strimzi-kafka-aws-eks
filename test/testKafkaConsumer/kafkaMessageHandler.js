const TestActions = require('./testActions/aggregator');

module.exports = async (type, action, params) => {

    switch (type) {
        case 'TEST':
            await TestActions[action](params);
            break;
        default:
            // Do nothing
            break;
    }
};
