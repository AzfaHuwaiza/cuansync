const ClientError = require('../exceptions/ClientError');

const errorHandler = (err,req , res, next) => {
    if(err.details){
        return res.status(err.statusCode || 400).json({
            status: 'failed',
            message: err.message,
            errors: err.details,
        })
    }

    if(err instanceof ClientError) {
        return res.status(err.statusCode).json({
            status: 'failed',
            message: err.message,
        });
    };

    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Terjadi kesalahan di server' : err.message;

    if(statusCode === 500){
        console.error(`[SYSTEM ERROR] : `, err);
    };
    
    res.status(statusCode).json({
        status : statusCode === 500 ? 'Error' : 'Gagal',
        message: message
    });
};

module.exports = errorHandler;