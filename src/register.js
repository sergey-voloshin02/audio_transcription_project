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

// Функция для регистрации пользователя
async function registerUser(email, password) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Проверяем, существует ли уже пользователь с таким email
        const [users] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        if (users.length > 0) {
            throw new Error('User already exists');
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Вставляем пользователя в таблицу users
        const [insertResult] = await connection.query('INSERT INTO users (login, password, email) VALUES (?, ?, ?)', [email, hashedPassword, email]);
        const userId = insertResult.insertId;

        // Создаем токен
        const token = uuidv4();
        await connection.query('INSERT INTO tokens (token, user_id) VALUES (?, ?)', [token, userId]);

        await connection.commit();
        return token;
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
    registerUser
};
