const express = require('express');
const app = express();
const port = 3000;
const multer = require('multer');
const { transcribeAudio } = require('./transAudioToText');
const { registerUser } = require('./register');
const { loginUser } = require('./login');
const { checkToken } = require('./check-token');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware для разрешения CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

app.get('/ping', (req, res) => {
    res.send('pongg');
});

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Регистрация пользователя и получение токена
        const token = await registerUser(email, password);

        // Отправляем токен обратно клиенту
        res.status(201).json({ token });
    } catch (error) {
        if (error.message === 'User already exists') {
            res.status(409).json({ error: error.message });
        } else {
            console.log('Registration error:', error);
            res.status(500).json({ error: 'An error occurred during the registration process.' });
        }
    }
});

app.post('/check-token', async (req, res) => {
    try {
        
        const { userToken } = req.body;

        const result = await checkToken(userToken);

        res.status(201).json({ result });
    } catch (error) {
        console.log('Unexpected error:', error);
        res.status(500).json({ error: 'Unexpected error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Регистрация пользователя и получение токена
        const token = await loginUser(email, password);

        // Отправляем токен обратно клиенту
        res.status(201).json({ token });
    } catch (error) {
        if (error.message === 'User not found' || 'Password is incorrect') {
            res.status(200).json({ error: error.message });
        } else {
            console.log('Auth error:', error);
            res.status(500).json({ error: 'An error occurred during the Auth process.' });
        }
    }
});


app.post('/trans-audio-to-text', upload.single('audioFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded.' });
        }
        const audioFilePath = req.file.path;

        const transcription = await transcribeAudio(audioFilePath);

        fs.unlinkSync(audioFilePath);

        res.json({ transcription });
    } catch (error) {
        console.error('Error processing audio file:', error);
        res.status(500).json({ error: 'An error occurred while processing the audio file.' });
    }
});

app.listen(port, () => {
    console.log(`Test API listening at http://localhost:${port}`);
});