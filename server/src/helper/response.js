const success = (res , data , message = '', statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data
    });
}

const failed = (res, message = '', statusCode = 400) => {
    return res.status(statusCode).json({
        status: 'failed',
        message
    });
};

module.exports = { success, failed };