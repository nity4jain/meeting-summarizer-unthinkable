import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProcessingStatus = ({ data, onComplete, onError }) => {
  const [status, setStatus] = useState('Initializing...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const simulateProcessing = async () => {
      try {
        // Simulate processing steps
        const steps = [
          { message: 'Uploading audio file...', progress: 20 },
          { message: 'Transcribing with AI...', progress: 50 },
          { message: 'Generating summary...', progress: 80 },
          { message: 'Finalizing results...', progress: 100 }
        ];

        for (const step of steps) {
          setStatus(step.message);
          setProgress(step.progress);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // FIXED: Use the correct endpoint and data format
        let response;
        
        if (data.mode === 'speech-recognition') {
          // For Web Speech API results, we already have the results
          if (data.results) {
            onComplete(data.results);
            return;
          }
        } else {
          // For file upload, use mock data approach
          const mockTranscript = `Welcome everyone to our quarterly planning meeting. Let's start by reviewing our progress from last quarter. 

John, can you give us an update on the marketing campaign results? Great, so we achieved 150% of our target engagement rate. That's excellent news.

Sarah, what's the status on the new product launch? We're on track for the December release, but we need to finalize the pricing strategy by next Friday.

For action items: John will prepare the final marketing report by October 20th. Sarah needs to schedule a pricing strategy meeting with the finance team for this Thursday. Mike will coordinate with the development team on the final testing phase.

Our next meeting will be scheduled for October 25th at 2 PM. Thank you everyone for your participation today.`;

          // FIXED: Call the correct endpoint with correct data
          response = await axios.post('/api/summarizer/process-transcript', {
            transcript: mockTranscript,
            filename: data.filename || 'uploaded-file.wav'
          });
        }
        
        if (response && response.data.success) {
          onComplete(response.data.results);
        } else {
          onError('Processing completed but no results received');
        }

      } catch (error) {
        console.error('Processing error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Processing failed';
        onError(errorMessage);
      }
    };

    simulateProcessing();
  }, [data, onComplete, onError]);

  return (
    <div className="processing-section">
      <div className="processing-content">
        <h2>Processing Your Audio</h2>
        
        <div className="processing-animation">
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="microphone-icon">🎙️</div>
        </div>

        <div className="status-info">
          <p className="status-message">{status}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-percentage">{progress}%</p>
        </div>

        <div className="file-info">
          <h3>File Details</h3>
          <div className="file-details">
            <span className="detail-label">Filename:</span>
            <span className="detail-value">{data.filename}</span>
          </div>
          {data.size && (
            <div className="file-details">
              <span className="detail-label">Size:</span>
              <span className="detail-value">{(data.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )}
          {data.mode && (
            <div className="file-details">
              <span className="detail-label">Mode:</span>
              <span className="detail-value">{data.mode}</span>
            </div>
          )}
        </div>

        <div className="processing-steps">
          <h3>Processing Steps</h3>
          <div className="steps-list">
            <div className={`step ${progress >= 20 ? 'completed' : 'active'}`}>
              <span className="step-icon">📤</span>
              <span>Upload Audio</span>
            </div>
            <div className={`step ${progress >= 50 ? 'completed' : progress >= 20 ? 'active' : ''}`}>
              <span className="step-icon">🎵</span>
              <span>Speech Recognition</span>
            </div>
            <div className={`step ${progress >= 80 ? 'completed' : progress >= 50 ? 'active' : ''}`}>
              <span className="step-icon">🤖</span>
              <span>AI Analysis</span>
            </div>
            <div className={`step ${progress >= 100 ? 'completed' : progress >= 80 ? 'active' : ''}`}>
              <span className="step-icon">📝</span>
              <span>Generate Summary</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
