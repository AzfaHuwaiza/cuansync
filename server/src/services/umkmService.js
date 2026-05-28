const db = require('../config/db');
const ClientError = require('../exceptions/ClientError');
const fs = require('fs');
const path = require('path');


const getAllUMKM = async () => {
    const [rows] = await db.execute(`SELECT um.id,mem.user_id, um.photo_url, um.description AS note, um.name AS nama_umkm,um.sector, o.name AS nama_owner, o.email AS email_owner FROM umkms AS um JOIN umkm_members AS mem ON um.id = mem.umkm_id JOIN users AS o ON mem.user_id = o.id WHERE mem.role = 'owner'`);
    return rows;
}

const getUMKMById = async (id) => {
    const [rows] = await db.execute(`SELECT um.id,mem.user_id, um.photo_url, um.name AS nama_umkm,um.sector,um.description AS note,um.create_at,um.updated_at, o.name AS nama_owner, o.email AS email_owner FROM umkms AS um JOIN umkm_members AS mem ON um.id = mem.umkm_id JOIN users AS o ON mem.user_id = o.id WHERE um.id = ? AND mem.role = 'owner'`, [id]);
    return rows[0];
}

const getUMKMByUserId = async (userId) => {
    const [rows] = await db.execute(`SELECT um.id, mem.user_id, um.photo_url, um.description AS note, um.name AS nama_umkm, um.sector, o.name AS nama_owner, o.email AS email_owner FROM umkms AS um JOIN umkm_members AS mem ON um.id = mem.umkm_id JOIN users AS o ON mem.user_id = o.id WHERE mem.user_id = ? AND mem.role = 'owner'`, [userId]);
    return rows;
}

const createUMKM = async (ownerId, name, sector, description, photo_url) => {
    const [existing] = await db.execute('SELECT id FROM users WHERE id = ?', [ownerId]);
    if(existing.length === 0) throw new ClientError('Owner tidak ditemukan');

    const [lastUser] = await db.execute('SELECT id FROM umkms ORDER BY CAST(SUBSTRING(id, 5) AS UNSIGNED) DESC LIMIT 1 FOR UPDATE');
        let umkmId = 'UMKM001';
        if(lastUser.length > 0){
            const lastId = lastUser[0].id;
            const lastNumber = parseInt(lastId.replace('UMKM', ''), 10);
            umkmId = `UMKM${String(lastNumber + 1).padStart(3, '0')}`;
        }

    const finalPhotoUrl = photo_url || '';

    const [result] = await db.execute('INSERT INTO umkms (id, name, sector, description, photo_url) VALUES (?, ?, ?, ?, ?)', [umkmId, name, sector, description, finalPhotoUrl]);
    await db.execute(`INSERT INTO umkm_members (id, user_id, umkm_id, role) VALUES (UUID(), ?, ?, 'owner')`, [ownerId, umkmId]);
    return { id: umkmId, user_id: ownerId, name, sector, description, photo_url: finalPhotoUrl };
}
    
const updateUMKM = async (id, ownerId, name, sector, description, photo_url) => {
    const [existing] = await db.execute('SELECT id, photo_url FROM umkms WHERE id = ?', [id]);
    if(existing.length === 0) throw new ClientError('UMKM tidak ditemukan');
    const [existingOwner] = await db.execute('SELECT id FROM users WHERE id = ?', [ownerId]);
    if(existingOwner.length === 0) throw new ClientError('Owner tidak ditemukan');

    const [access] = await db.execute(`SELECT role FROM umkm_members WHERE umkm_id = ? AND user_id = ? AND role = 'owner'`, [id, ownerId]);
    if(access.length === 0 || access[0].role !== 'owner') throw new ClientError('Anda tidak memiliki akses untuk mengubah UMKM ini');

    const finalFoto = photo_url ? photo_url : existing[0].photo_url;
    const [result] = await db.execute('UPDATE umkms SET name = ?, sector = ?, description = ?, photo_url = COALESCE(?, photo_url), updated_at = NOW() WHERE id = ?', [name, sector, description, photo_url, id]);
    

    return { id, user_id: ownerId, name, sector, description, photo_url: finalFoto };
}

const deleteUMKM = async (id, ownerId, role) => {
    const [existing] = await db.execute('SELECT id, photo_url FROM umkms WHERE id = ?', [id]);
    if(existing.length === 0) throw new ClientError('UMKM tidak ditemukan');

    if(role !== 'admin') {
        const [access] = await db.execute(`SELECT role FROM umkm_members WHERE umkm_id = ? AND user_id = ? AND role = 'owner'`, [id, ownerId]);
        if(access.length === 0) throw new ClientError('Anda tidak memiliki akses untuk menghapus UMKM ini');
    }else{
        const [access] = await db.execute(`SELECT role FROM users WHERE id = ? AND role = 'admin'`, [ownerId]);
        if(access.length === 0) throw new ClientError('Anda tidak memiliki akses untuk menghapus UMKM ini');
    }

    const [result] = await db.execute('DELETE FROM umkms WHERE id = ?', [id]);
   
    return { id };
}

const getAllCountUMKM = async () => {
    const [rows] = await db.execute('SELECT COUNT(*) AS totalUMKM FROM umkms');
    return rows[0].totalUMKM;
}

const getAllUmkmLast = async () => {
    const [rows] = await db.execute(`SELECT um.id, um.name AS namaUmkm, um.sector, um.description, um.photo_url, o.name AS namaOwner FROM umkms AS um LEFT JOIN umkm_members AS mem ON um.id = mem.umkm_id AND mem.role = 'owner' LEFT JOIN users AS o ON mem.user_id = o.id ORDER BY um.create_at DESC LIMIT 5`);
    return rows;
}

const getAllUMKMByAdmin = async () => {
    const [rows] = await db.execute(`SELECT um.id, um.name AS namaUmkm, um.sector, um.description, um.photo_url AS img, o.name AS namaOwner, COUNT(t.id) AS totalTransactions FROM umkms AS um LEFT JOIN umkm_members AS mem ON um.id = mem.umkm_id AND mem.role = 'owner' LEFT JOIN users AS o ON mem.user_id = o.id LEFT JOIN transactions AS t ON um.id = t.umkm_id GROUP BY um.id, um.name, um.sector, um.description, um.photo_url, o.name`);
    return rows;
}

module.exports = { getAllUMKM, getUMKMById, createUMKM, updateUMKM, deleteUMKM, getUMKMByUserId, getAllCountUMKM, getAllUmkmLast, getAllUMKMByAdmin };