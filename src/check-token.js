const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '172.20.0.2',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'audio2txt',
});

async function checkToken(token) {
    let connection;
    try {
        connection = await pool.getConnection();

        const [rows] = await connection.query('SELECT token FROM tokens WHERE token = ?', [token]);

        // Проверяем, найден ли токен
        if (rows.length > 0) {
            return { found: true };
        } else {
            return { found: false };
        }
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    checkToken
};
