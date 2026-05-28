const Joi = require('joi');
const { createValidator } = require('../helper/validator');

const schema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Nama UMKM tidak boleh kosong',
        'any.required': 'Nama UMKM harus diisi'
    }),
    sector: Joi.string().valid(
        'Kerajinan', 
        'Transportasi', 
        'Pendidikan', 
        'Pertanian', 
        'Fashion', 
        'Kuliner', 
        'Teknologi', 
        'Kesehatan', 
        'Jasa', 
        'Properti',
    ).required().messages({
        'any.only': 'Sektor UMKM tidak valid',
        'string.empty': 'Sektor UMKM tidak boleh kosong',
        'any.required': 'Sektor UMKM harus diisi'
    }),
    description: Joi.string().required().messages({ 
        'string.empty': 'Deskripsi UMKM tidak boleh kosong',
        'any.required': 'Deskripsi UMKM harus diisi'
    })
});

const validateUmkm = createValidator(schema);


module.exports = {validateUmkm};