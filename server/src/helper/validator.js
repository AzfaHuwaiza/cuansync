const InvariantError = require('../exceptions/InvariantError');

const createValidator = (schema) => {
    return (payload) => {
        const validationResult = schema.validate(payload, {
            abortEarly: false,
            stripUnknown: true
        });

        if(validationResult.error){
            const errorDetails = {};
            validationResult.error.details.forEach(err => {
                if(!errorDetails[err.context.key]){
                    errorDetails[err.context.key] = err.message;
                }
            });

            const errorMessage = new InvariantError('Validasi Gagal');
            errorMessage.details = errorDetails;
            throw errorMessage;
        }
        return validationResult.value;
    };
};

const validateRouter = (validator) => (req, res, next) => {
    try {
        req.body = validator(req.body);
        next();
    } catch (error) {
        next(error);
    }
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { createValidator, validateRouter, asyncHandler };
