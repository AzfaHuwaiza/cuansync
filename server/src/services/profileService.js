const db = require('../config/db');
const ClientError = require('../exceptions/ClientError');
const fs = require('fs');
const path = require('path');

const getProfileId = async (user_id) => {
    const [rows] = await db.execute('SELECT prf.id, usr.role, usr.name, usr.email, prf.gender, prf.phone_number, prf.address, prf.date_of_birth, prf.photo_url FROM users AS usr LEFT JOIN profiles AS prf ON usr.id = prf.user_id WHERE usr.id = ?', [user_id]);
    return rows[0];
};

const updateProfile = async (user_id, data) => {
    const [existing] = await db.execute('SELECT id, photo_url FROM profiles WHERE user_id = ?', [user_id]);
    if(existing.length === 0){
        const [lastProfile] = await db.execute('SELECT id FROM profiles ORDER BY CAST(SUBSTRING(id, 4) AS UNSIGNED) DESC LIMIT 1 FOR UPDATE');
        let newProfileId = 'PRF001';
        if(lastProfile.length > 0){
            const lastId = lastProfile[0].id;
            const lastNumber = parseInt(lastId.replace('PRF', ''), 10);
            newProfileId = `PRF${String(lastNumber + 1).padStart(3, '0')}`;
        }

        const imageDefault = '/uploads/profiles/default.png';
        const photo_url = data.photo_url || imageDefault;
        await db.execute('INSERT INTO profiles (id,user_id, gender, phone_number, address, date_of_birth, photo_url) VALUES (?,?,?,?,?,?,?)', [newProfileId, user_id, data.gender, data.phone_number, data.address, data.date_of_birth, photo_url]);
        return { id: newProfileId, user_id, ...data, photo_url: photo_url };
    } else {
        await db.execute('UPDATE profiles SET gender = ?, phone_number = ?, address = ?, date_of_birth = ?, photo_url = COALESCE(?, photo_url), updated_at = NOW() WHERE user_id = ?', [data.gender, data.phone_number, data.address, data.date_of_birth, data.photo_url, user_id]);

        const finalFoto = data.photo_url ? data.photo_url : existing[0].photo_url;

        return { user_id, ...data, photo_url: finalFoto};
    }
};

module.exports = { getProfileId, updateProfile };