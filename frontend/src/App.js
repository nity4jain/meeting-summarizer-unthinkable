import React, { useState } from 'react';
import AudioUploader from './components/AudioUploader';
import ProcessingStatus from './components/ProcessingStatus';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [currentStep, setCurrentStep] = useState('upload'); // upload, processing, results
  const [processingData, setProcessingData] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleUploadStart = (data) => {
    setCurrentStep('processing');
    setProcessingData(data);
    setError(null);
  };

  const handleProcessingComplete = (results) => {
    setCurrentStep('results');
    setResults(results);
    setProcessingData(null);
  };

  const handleProcessingError = (error) => {
    setError(error);
    setCurrentStep('upload');
    setProcessingData(null);
  };

  const resetToUpload = () => {
    setCurrentStep('upload');
    setResults(null);
    setError(null);
    setProcessingData(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1>🎙️ Meeting Summarizer</h1>
          <p>AI-powered transcription and intelligent summary generation</p>
        </div>
      </header>

      <main className="container">
        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
            <button onClick={resetToUpload} className="error-close">×</button>
          </div>
        )}

        {currentStep === 'upload' && (
          <AudioUploader 
            onUploadStart={handleUploadStart}
            onError={handleProcessingError}
          />
        )}

        {currentStep === 'processing' && (
          <ProcessingStatus 
            data={processingData}
            onComplete={handleProcessingComplete}
            onError={handleProcessingError}
          />
        )}

        {currentStep === 'results' && (
          <ResultsDisplay 
            results={results}
            onReset={resetToUpload}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>Built with React, Node.js, and OpenAI Whisper API</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
