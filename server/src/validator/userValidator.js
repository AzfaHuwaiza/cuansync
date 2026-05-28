const Joi = require('joi');
const { createValidator } = require('../helper/validator');


const schema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email tidak valid',
        'any.required': 'Email harus diisi',
        'any.empty': 'Email tidak boleh kosong'
    }),
    name: Joi.string().min(3).required().messages({
        'string.min': 'Nama minimal 3 karakter',
        'any.required': 'Nama harus diisi',
        'any.empty': 'Nama tidak boleh kosong'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password minimal 6 karakter',
        'any.required': 'Password harus diisi',
        'any.empty': 'Password tidak boleh kosong'
    }),
    role: Joi.string().valid('admin', 'user').required().messages({
        'any.only': 'Role harus admin atau user',
        'any.required': 'Role harus diisi',
        'any.empty': 'Role tidak boleh kosong'
    })    
});

const schemaUpdate = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email tidak valid',
        'any.required': 'Email harus diisi',
        'any.empty': 'Email tidak boleh kosong'
    }),
    name: Joi.string().min(3).required().messages({
        'string.min': 'Nama minimal 3 karakter',
        'any.required': 'Nama harus diisi',
        'any.empty': 'Nama tidak boleh kosong'
    }),
});


const userValidator = createValidator(schema);
const userUpdateValidator = createValidator(schemaUpdate);

module.exports = { userValidator, userUpdateValidator };