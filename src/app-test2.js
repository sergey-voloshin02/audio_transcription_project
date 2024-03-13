require('dotenv').config();
const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function transcribeAudio() {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(('uploads/audio-test.mp3')),
      model: 'whisper-1',
      language: 'uk',
      response_format: 'json'
    });

    console.log('Transcription:', transcription);
  } catch (error) {
    console.error('Error transcribing audio:', error);
  }
}

transcribeAudio();
