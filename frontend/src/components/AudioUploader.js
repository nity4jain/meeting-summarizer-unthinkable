import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import WebSpeechRecorder from './WebSpeechRecorder';

const AudioUploader = ({ onUploadStart, onError }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeMode, setActiveMode] = useState('file'); // 'file' or 'speech'

  const processTranscript = async (transcriptData) => {
  setUploading(true);
  
  try {
    // Send transcript directly to backend for summarization
    const response = await axios.post('/api/summarizer/process-transcript', {
      transcript: transcriptData.transcript,
      filename: transcriptData.filename
    });

    if (response.data.success) {
      // Pass the results directly to avoid double processing
      onUploadStart({ 
        filename: transcriptData.filename, 
        mode: 'speech-recognition',
        processing: true,
        results: response.data.results 
      });
    }

  } catch (error) {
    console.error('Processing error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Processing failed';
    onError(errorMessage);
  } finally {
    setUploading(false);
  }
};


  const processFile = async (file) => {
  setUploading(true);
  setUploadProgress(0);

  try {
    onUploadStart({ filename: file.name, size: file.size });

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 20) {
      setUploadProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // For demonstration, we'll use the mock transcript approach
    // In production, you would use a real transcription service
    const mockTranscript = `This is a sample transcription of the uploaded file: ${file.name}. 
    
The system has processed your audio file and extracted the following content: Team discussion about project milestones and deliverables. 

Key points discussed: Project timeline review, resource allocation for Q4, client feedback integration, and technical implementation details.

Action items identified: Development team to complete testing by end of week, Marketing to prepare campaign materials, Project manager to schedule client review meeting.

Meeting participants included project stakeholders and technical team members discussing critical project decisions and next steps.`;

    // Send to backend for summarization
    const response = await axios.post('/api/summarizer/process-transcript', {
      transcript: mockTranscript,
      filename: file.name
    });

    if (response.data.success) {
      setTimeout(() => {
        onUploadStart({ 
          filename: file.name, 
          processing: true,
          results: response.data.results 
        });
      }, 1000);
    }

  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
    onError(errorMessage);
  } finally {
    setUploading(false);
    setUploadProgress(0);
  }
};


  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles;
    await processFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg'],
      'video/*': ['.mp4', '.mpeg']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    disabled: uploading || activeMode === 'speech'
  });

  return (
    <div className="uploader-section">
      <div className="upload-instructions">
        <h2>Meeting Audio Processing</h2>
        <p>Choose your preferred input method:</p>
      </div>

      {/* Mode Selection */}
      <div className="mode-selector">
        <button 
          className={`mode-button ${activeMode === 'file' ? 'active' : ''}`}
          onClick={() => setActiveMode('file')}
          disabled={uploading}
        >
          📁 Upload Audio File
        </button>
        <button 
          className={`mode-button ${activeMode === 'speech' ? 'active' : ''}`}
          onClick={() => setActiveMode('speech')}
          disabled={uploading}
        >
          🎙️ Live Recording
        </button>
      </div>

      {activeMode === 'file' ? (
        <>
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}>
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="upload-progress">
                <div className="spinner"></div>
                <p>Processing your audio file...</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="progress-text">{uploadProgress}%</p>
              </div>
            ) : (
              <div className="upload-content">
                <div className="upload-icon">📁</div>
                {isDragActive ? (
                  <p><strong>Drop your audio file here</strong></p>
                ) : (
                  <>
                    <p><strong>Drag & drop an audio file here</strong></p>
                    <p>or <button type="button" className="browse-button">browse files</button></p>
                    <p className="format-info">Supports: MP3, WAV, M4A, OGG, MP4 (max 50MB)</p>
                  </>
                )}
              </div>
            )}
          </div>

          {fileRejections.length > 0 && (
            <div className="upload-errors">
              {fileRejections.map(({ file, errors }) => (
                <div key={file.path} className="error-message">
                  <strong>{file.path}</strong>
                  <ul>
                    {errors.map(e => <li key={e.code}>{e.message}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <WebSpeechRecorder 
          onTranscriptionComplete={processTranscript}
          onError={onError}
        />
      )}

      <div className="upload-features">
        <div className="feature-grid">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <h3>Real-time Processing</h3>
            <p>Instant speech-to-text in your browser</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <h3>Action Items</h3>
            <p>AI extracts tasks and decisions automatically</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📋</span>
            <h3>Smart Summaries</h3>
            <p>Key insights generated with free AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioUploader;
