
const transformMessageUppercase = async (params) => {
    console.log(`[TRANSFORM_MESSAGE_UPPERCASE] Processed message: ${String(params.message).toUpperCase()}`);
};

module.exports = {

    TRANSFORM_MESSAGE_UPPERCASE: transformMessageUppercase,

};