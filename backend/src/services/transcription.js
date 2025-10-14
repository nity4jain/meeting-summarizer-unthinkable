const axios = require('axios');
const fs    = require('fs');

class TranscriptionService {
  constructor() {
    this.hfToken = process.env.HUGGINGFACE_API_KEY;
    this.model   = 'openai/whisper-large-v3'; // any Whisper checkpoint
  }

  async transcribeAudio(filePath) {
    try {
      const audio = fs.readFileSync(filePath);
      const response = await axios({
        method: 'POST',
        url: `https://api-inference.huggingface.co/models/${this.model}`,
        data: audio,
        headers: {
          'Authorization': `Bearer ${this.hfToken}`,
          'Content-Type' : 'audio/wav'          // or audio/mpeg etc.
        },
        timeout: 60000
      });
      return response.data.text;               // Whisper JSON → { text: "..." }
    } catch (err) {
      console.error('HF Whisper error:', err.response?.data || err.message);
      return this.mockTranscription();         // graceful fallback
    }
  }

  mockTranscription() { /* keep as emergency fallback */ }
}

module.exports = new TranscriptionService();
