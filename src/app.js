require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const OpenAI = require('openai');

const app = express();
const upload = multer({ dest: 'uploads/' });
const openai = new OpenAI();

// Разрешаем серверу обрабатывать JSON данные
app.use(express.json());

// Маршрут для загрузки аудио и транскрибации
app.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    // Проверяем наличие загруженного файла
    if (!req.file) {
      return res.status(400).json({ error: 'file not found' });
    }

    // Путь к загруженному файлу
    const filePath = req.file.path;

    // Читаем файл в буфер
    const fileBuffer = fs.readFileSync(filePath);

    // Отправляем файл на транскрибацию к OpenAI
    const transcription = await openai.audio.transcriptions.create({
      file: fileBuffer,
      model: "whisper-1",
    });

    // Удаляем временный файл
    fs.unlinkSync(filePath);

    // Возвращаем результат транскрибации
    return res.json({ transcription: transcription.text });
  } catch (error) {
    console.error('error with audio transcription:', error);
    return res.status(500).json({ error: 'error with audio transcription' });
  }
});
