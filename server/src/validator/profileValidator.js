const { createValidator } = require('../helper/validator');
const Joi = require('joi');

const schema = Joi.object({
    gender: Joi.string().valid('Laki-laki', 'Perempuan').required(),
    phone_number: Joi.string().allow('').min(10).max(15).required(),
    address: Joi.string().allow('').required(),
    date_of_birth: Joi.date().less('now').required(),
    photo_url: Joi.string().allow('').optional(),
});

const profileValidator = createValidator(schema);

module.exports = profileValidator;
