const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const transcriptionService = require('../services/transcription');
const summarizationService = require('../services/summarization');
const fileHandler = require('../utils/fileHandler');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/mp4',
      'audio/m4a', 'audio/ogg', 'video/mp4', 'video/mpeg'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload audio/video files only.'));
    }
  }
});

// Process transcript directly (for Web Speech API results)
router.post('/process-transcript', async (req, res) => {
  try {
    const { transcript, filename } = req.body;

    if (!transcript || transcript.trim() === '') {
      return res.status(400).json({ 
        error: 'No transcript provided',
        message: 'Please provide a valid transcript text'
      });
    }

    console.log(`Processing transcript for: ${filename}`);

    // Generate summary directly from transcript
    const summary = await summarizationService.generateSummary(transcript);

    // Return results
    res.json({
      success: true,
      results: {
        filename: filename || 'voice-recording.wav',
        transcript: transcript,
        summary: summary.summary,
        keyDecisions: summary.keyDecisions,
        actionItems: summary.actionItems,
        attendees: summary.attendees || [],
        processingTime: new Date().toISOString(),
        method: 'web-speech-api'
      }
    });

  } catch (error) {
    console.error('Transcript processing error:', error);
    
    res.status(500).json({
      error: 'Processing failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Upload and process audio file
router.post('/process', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;

    console.log(`Processing file: ${fileName}`);

    // Step 1: Transcribe audio (using mock since we don't have paid API)
    const transcript = await transcriptionService.transcribeAudio(filePath);
    
    if (!transcript || transcript.trim() === '') {
      return res.status(400).json({ 
        error: 'Transcription failed',
        message: 'Could not extract text from the audio file'
      });
    }

    // Step 2: Generate summary
    const summary = await summarizationService.generateSummary(transcript);

    // Step 3: Clean up uploaded file
    await fileHandler.cleanupFile(filePath);

    // Return results
    res.json({
      success: true,
      results: {
        filename: req.file.originalname,
        transcript: transcript,
        summary: summary.summary,
        keyDecisions: summary.keyDecisions,
        actionItems: summary.actionItems,
        attendees: summary.attendees || [],
        processingTime: new Date().toISOString(),
        method: 'file-upload-demo'
      }
    });

  } catch (error) {
    console.error('Processing error:', error);
    
    // Clean up file if error occurs
    if (req.file) {
      await fileHandler.cleanupFile(req.file.path).catch(console.error);
    }

    res.status(500).json({
      error: 'Processing failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get processing status (for future enhancement)
router.get('/status/:id', (req, res) => {
  res.json({
    id: req.params.id,
    status: 'completed',
    message: 'Processing complete'
  });
});

module.exports = router;
