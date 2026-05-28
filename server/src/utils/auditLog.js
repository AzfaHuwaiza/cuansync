const auditLog = async (connection, user_id, aksi, tabel_target, data_sebelum, ip_address, waktu) => {
    const jsonLama = data_sebelum ? JSON.stringify(data_sebelum) : null;

    await connection.execute(
        'INSERT INTO audit_logs (user_id, aksi, tabel_target, data_sebelum, ip_address, waktu) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, aksi, tabel_target, jsonLama, ip_address, waktu]

    )
}

module.exports = { auditLog }