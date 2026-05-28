const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const ClientError = require('../exceptions/ClientError');


const registerUser = async (email, password, name, role ) => {
    const connection = await db.getConnection();
    try{
        await connection.beginTransaction();
        const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
        if(existing.length > 0) throw new ClientError('Email sudah terdaftar, silahkan gunakan yang lain', 400);

        const [lastUser] = await connection.execute('SELECT id FROM users ORDER BY CAST(SUBSTRING(id, 4) AS UNSIGNED) DESC LIMIT 1 FOR UPDATE');
        let newUserId = 'USR001';
        if(lastUser.length > 0){
            const lastId = lastUser[0].id;
            const lastNumber = parseInt(lastId.replace('USR', ''), 10);
            newUserId = `USR${String(lastNumber + 1).padStart(3, '0')}`;
        }


        const hashPassword = await bcrypt.hash(password, 10);
    await connection.execute('INSERT INTO users (id, email, password, name, role) VALUES (?,?,?,?, ?)', [newUserId, email, hashPassword, name, role]);

        await connection.commit();
        return newUserId;
    }catch(err){
        await connection.rollback();
        throw err;
    }finally{
        connection.release();
    }
}

const loginUser = async (email, password) => {
    const [users] = await db.execute('SELECT id, email, password, role FROM users WHERE email = ?', [email]);
    if(users.length === 0) throw new ClientError('Email atau password salah', 401);

    const match = await bcrypt.compare(password, users[0].password);
    if(!match) throw new ClientError('Email atau password salah', 401);
    const userId = users[0].id;

    const payload = { id: userId, email: users[0].email, role: users[0].role };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: '7d' });
    
    const expired = new Date();
    expired.setDate(expired.getDate() + 7);
    
    await db.execute('DELETE FROM authenticate WHERE id_user = ? AND expires_at <= NOW()', [users[0].id]);
    await db.execute('INSERT INTO authenticate (id_user,token, expires_at) VALUES (?,?,?)', [users[0].id, refreshToken,expired]);

    return { accessToken, refreshToken, id: userId, role: users[0].role };
}

const verifyRefreshToken = async (token, id_user) => {
    const [rows] = await db.execute('SELECT token, id_user, expires_at FROM authenticate WHERE id_user = ? AND token = ? AND expires_at > NOW()', [id_user, token]);
    if(rows.length === 0) throw new ClientError('Refresh token tidak valid atau sudah expired', 401);

    try{
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);
        return decoded;
    }catch(err){
        if(err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError'){
            await db.execute('DELETE FROM authenticate WHERE token = ?', [token]);
            throw new ClientError('Refresh token sudah kadaluarsa, silahkan login kembali.', 401);
        }
    }
}

const logoutUser = async (token) => {
    const [rows] = await db.execute('DELETE FROM authenticate WHERE token = ?', [token]);
    if(rows.affectedRows === 0) throw new ClientError('Refresh token tidak ditemukan', 400);
}

const updateUser = async (id, email, name) => {
    const [existing] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    if(existing.length === 0) throw new ClientError('User tidak ditemukan');

    const [existingEmail] = await db.execute('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
    if(existingEmail.length > 0) throw new ClientError('Email sudah digunakan oleh user lain');

    const [result] = await db.execute('UPDATE users SET email = ?, name = ?, updated_at = NOW() WHERE id = ?', [email, name, id]);
    return { id, email, name };
}

const getAllCountUsers = async () => {
    const [rows] = await db.execute('SELECT COUNT(*) AS totalUsers FROM users');
    return rows[0].totalUsers;
}

const get5Users = async () => {
    const [rows] = await db.execute('SELECT u.id, u.email, u.name, u.create_at, u.role, p.photo_url AS img FROM users u LEFT JOIN profiles p ON u.id = p.user_id ORDER BY u.create_at DESC LIMIT 5');
    return rows;
}

const getAllUsers = async () => {
    const [rows] = await db.execute('SELECT u.id, u.email, u.name, u.create_at, u.role, p.photo_url AS img, pr.phone_number AS kontak, pr.updated_at AS update_profile FROM users u LEFT JOIN profiles p ON u.id = p.user_id LEFT JOIN profiles pr ON u.id = pr.user_id');
    return rows;
}

const updateRoleUser = async (id, role) => {
    const [existing] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    if(existing.length === 0) throw new ClientError('User tidak ditemukan');

    const [result] = await db.execute('UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?', [role, id]);
    return { id, role };
}

module.exports = { registerUser, loginUser, verifyRefreshToken, logoutUser, updateUser, getAllCountUsers, get5Users, getAllUsers, updateRoleUser };