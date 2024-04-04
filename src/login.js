const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '172.20.0.2',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'audio2txt',
});

async function loginUser(email, password) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Ищем пользователя по email
        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            throw new Error('User not found');
        }

        const user = users[0];

        // Проверяем пароль
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error('Password is incorrect');
        }

        // Создаем новый токен
        const token = uuidv4();
        await connection.query('INSERT INTO tokens (token, user_id) VALUES (?, ?)', [token, user.id]);

        await connection.commit();
        return token; // Возвращаем токен на фронт
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    loginUser
};

