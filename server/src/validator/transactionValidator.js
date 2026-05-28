const Joi = require('joi');
const { createValidator } = require('../helper/validator');

const schema = Joi.object({
    umkm_id: Joi.string().required().messages({
        'string.base': 'umkm_id harus berupa string',
        'string.empty': 'umkm_id tidak boleh kosong',
        'any.required': 'umkm_id harus diisi',
    }),
    type: Joi.string().valid('income', 'expense').required().messages({
        'string.base': 'type harus berupa string',
        'any.only': 'type harus bernilai income atau expense',
        'string.empty': 'type tidak boleh kosong',
    }),
    amount: Joi.number().required().messages({
        'number.base': 'amount harus berupa angka',
        'any.required': 'amount harus diisi',
    }),
    note: Joi.string().required().messages({
        'string.base': 'note harus berupa string',
        'string.empty': 'note tidak boleh kosong',
        'any.required': 'note harus diisi',
    }),
    product_name: Joi.string().required().messages({
        'string.base': 'product_name harus berupa string',
        'string.empty': 'product_name tidak boleh kosong',
        'any.required': 'product_name harus diisi',
    }),
});

const validateTransaction = createValidator(schema);

module.exports = {
    validateTransaction,
};