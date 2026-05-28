const Joi = require('joi');
const { createValidator } = require('../helper/validator');

const schema = Joi.object({
    umkm_id: Joi.string().required().messages({
        'string.base': 'umkm_id harus berupa string',
        'string.empty': 'umkm_id tidak boleh kosong',
        'any.required': 'umkm_id harus diisi',
    }),
    name: Joi.string().required().messages({
        'string.base': 'name harus berupa string',
        'string.empty': 'name tidak boleh kosong',
        'any.required': 'name harus diisi',
    }),
    category: Joi.string().valid(
    'Teknologi',
    'Pertanian',
    'Minuman',
    'Makanan',
    'Elektronik',
    'Kerajinan',
    'Kesehatan',
    'Pakaian',
    'Kecantikan',
    'Logistik',
    'Servis Kendaraan',
    'Event Organizer',
    'Alat Kesehatan',
    'Suplemen',
    'Obat Herbal',
    'Pakaian Pria',
    'Desain',
    'Perawatan',
    'Jasa Medis',
    'Interior',
    'Kursus Offline',
    'Buku',
    'Kursus Online',
    'Dessert',
    'Makanan Berat',
    'Bibit',
    'Alat Tani',
    'Produk Olahan',
    'Bimbel',
    'Pelatihan',
    'IoT',
    'Software',
    'Jasa IT',
    'Servis'
    ).required().messages({
        'string.empty': 'Kategori produk tidak boleh kosong',
        'any.required': 'Kategori produk harus diisi',
        'any.only': 'Kategori tidak valid. Pilih sesuai daftar yang ada.'
    }),
    base_price: Joi.number().required().messages({
        'number.base': 'base_price harus berupa angka',
        'any.required': 'base_price harus diisi',
    }),
});

const validateProduct = createValidator(schema);

module.exports = {
    validateProduct,
};