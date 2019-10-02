const paintMessageCyan = async (params) => {
    console.log(`[PAINT_MESSAGE_CYAN] Processed message: \x1b[36m${String(params.message)}\x1b[0m`);
};

const paintMessageGreen = async (params) => {
    console.log(`[PAINT_MESSAGE_GREEN] Processed message: \x1b[32m${String(params.message)}\x1b[0m`);
};

const paintMessageBlue = async (params) => {
    console.log(`[PAINT_MESSAGE_BLUE] Processed message: \x1b[34m${String(params.message)}\x1b[0m`);
};

module.exports = {

    PAINT_MESSAGE_CYAN: paintMessageCyan,

    PAINT_MESSAGE_GREEN: paintMessageGreen,

    PAINT_MESSAGE_BLUE: paintMessageBlue
};