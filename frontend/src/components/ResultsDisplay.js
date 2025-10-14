import React, { useState } from 'react';

const ResultsDisplay = ({ results, onReset }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const downloadResults = () => {
    const content = `
MEETING SUMMARY REPORT
Generated: ${new Date().toLocaleDateString()}
File: ${results.filename}

SUMMARY:
${results.summary}

KEY DECISIONS:
${results.keyDecisions?.map(decision => `• ${decision}`).join('\n') || 'None identified'}

ACTION ITEMS:
${results.actionItems?.map(item => `• ${item}`).join('\n') || 'None identified'}

ATTENDEES:
${results.attendees?.map(attendee => `• ${attendee}`).join('\n') || 'Not specified'}

TRANSCRIPT:
${results.transcript}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <div className="results-section">
      <div className="results-header">
        <h2>📝 Meeting Analysis Complete</h2>
        <div className="results-actions">
          <button onClick={downloadResults} className="download-btn">
            📥 Download Report
          </button>
          <button onClick={onReset} className="new-upload-btn">
            🎙️ New Upload
          </button>
        </div>
      </div>

      <div className="file-info">
        <span className="file-name">📁 {results.filename}</span>
        <span className="processing-time">⏱️ Processed: {new Date(results.processingTime).toLocaleTimeString()}</span>
      </div>

      <div className="results-tabs">
        <button 
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button 
          className={`tab ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          Action Items
        </button>
        <button 
          className={`tab ${activeTab === 'transcript' ? 'active' : ''}`}
          onClick={() => setActiveTab('transcript')}
        >
          Full Transcript
        </button>
      </div>

      <div className="results-content">
        {activeTab === 'summary' && (
          <div className="summary-tab">
            <div className="summary-card">
              <div className="card-header">
                <h3>📋 Meeting Summary</h3>
                <button 
                  onClick={() => copyToClipboard(results.summary)}
                  className="copy-btn"
                >
                  📋 Copy
                </button>
              </div>
              <p className="summary-text">{results.summary}</p>
            </div>

            {results.keyDecisions && results.keyDecisions.length > 0 && (
              <div className="summary-card">
                <div className="card-header">
                  <h3>✅ Key Decisions</h3>
                  <button 
                    onClick={() => copyToClipboard(results.keyDecisions.join('\n'))}
                    className="copy-btn"
                  >
                    📋 Copy
                  </button>
                </div>
                <ul className="decisions-list">
                  {results.keyDecisions.map((decision, index) => (
                    <li key={index}>{decision}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.attendees && results.attendees.length > 0 && (
              <div className="summary-card">
                <h3>👥 Attendees</h3>
                <div className="attendees-list">
                  {results.attendees.map((attendee, index) => (
                    <span key={index} className="attendee-tag">{attendee}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="actions-tab">
            <div className="summary-card">
              <div className="card-header">
                <h3>🎯 Action Items</h3>
                <button 
                  onClick={() => copyToClipboard(results.actionItems?.join('\n') || 'No action items found')}
                  className="copy-btn"
                >
                  📋 Copy All
                </button>
              </div>
              {results.actionItems && results.actionItems.length > 0 ? (
                <div className="action-items">
                  {results.actionItems.map((item, index) => (
                    <div key={index} className="action-item">
                      <div className="action-checkbox">
                        <input type="checkbox" id={`action-${index}`} />
                        <label htmlFor={`action-${index}`}></label>
                      </div>
                      <div className="action-content">
                        <p>{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-actions">No specific action items were identified in this meeting.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transcript' && (
          <div className="transcript-tab">
            <div className="summary-card">
              <div className="card-header">
                <h3>📄 Full Transcript</h3>
                <button 
                  onClick={() => copyToClipboard(results.transcript)}
                  className="copy-btn"
                >
                  📋 Copy
                </button>
              </div>
              <div className="transcript-content">
                <pre>{results.transcript}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
