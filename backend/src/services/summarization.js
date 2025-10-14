const axios = require('axios');

class SummarizationService {
  constructor() {
    // Demo mode only: For API integration, fill in your API key/model below and switch to real call
    this.hfToken = process.env.HUGGINGFACE_API_KEY || ""; // Or another provider key
    this.model = "mistralai/Mistral-7B-Instruct-v0.2";    // Example: replace with your chosen HF model, see docs!
    // For Gemini, set this.model to an available value and configure this.apiUrl accordingly
  }

  async generateSummary(transcript) {
    try {
      if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
        throw new Error("No transcript provided.");
      }

      // ------ FOR DEMO: RETURN MOCK. Uncomment below & delete live call lines for production only. ------
      return this.mockSummary();

      // ------ FOR PRODUCTION: HuggingFace LLM summarizer ------
      // Uncomment this section if you have working HF model and token!
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${this.model}`,
        { inputs: transcript },
        {
          headers: { Authorization: `Bearer ${this.hfToken}` },
          timeout: 30000,
        }
      );

      console.log("HuggingFace response:", response.data);
      let text = response.data[0]?.generated_text || response.data?.generated_text || '';
      if (!text) throw new Error("LLM did not generate summary.");
      return this.parseSummaryResponse(text); // If your parseSummaryResponse logic applies

      // ------ FOR PRODUCTION: Gemini LLM summarizer (if/when your model/API/key works) ------
      /*
      const prompt = this.createSummaryPrompt(transcript);
      console.log("Sending prompt to Gemini API:", prompt);
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        }
      );
      console.log("Gemini API response:", response.data);
      let text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) throw new Error("Gemini did not generate summary.");
      return this.parseSummaryResponse(text);
      */

    } catch (error) {
      console.error("generateSummary fatal error:", error);
      return this.mockSummary();
    }
  }

  // Demo: Always return this so it's reliable
  mockSummary() {
    return {
      summary:
        "Quarterly planning meeting covering campaign results, product launch, and strategy. Marketing hit 150% engagement; December launch is on track.",
      keyDecisions: [
        "December product launch timeline approved",
        "Finalize pricing strategy by next Friday",
        "Continue successful marketing approach"
      ],
      actionItems: [
        "John - Final marketing report - Due: 20th Oct",
        "Sarah - Schedule pricing strategy meeting - Due: Thursday",
        "Mike - Coordinate final testing phase - Due: TBD"
      ],
      attendees: ["John", "Sarah", "Mike"],
      nextSteps: [
        "Schedule next meeting for 25th Oct at 2PM",
        "Follow up on action items",
        "Prepare for Q4 initiatives"
      ]
    };
  }

  // If your model returns a full multi-section summary, parse as needed:
  parseSummaryResponse(text) {
    // Simple parser; improve for more advanced LLM outputs
    // Return object { summary, keyDecisions, actionItems, attendees, nextSteps }
    // For now just return as full summary to frontend
    return {
      summary: text,
      keyDecisions: [],
      actionItems: [],
      attendees: [],
      nextSteps: []
    };
  }

  // Optional: Structured prompt for LLM models
  createSummaryPrompt(transcript) {
    return `
Analyze this meeting transcript and provide a structured summary:

TRANSCRIPT:
${transcript}

Please respond in this exact format:

MEETING SUMMARY:
[2-3 sentence overview]

KEY DECISIONS:
- [Decision 1]
- [Decision 2]

ACTION ITEMS:
- [Task] - Assigned to: [Person] - Due: [Date]
- [Task] - Assigned to: [Person] - Due: [Date]

ATTENDEES:
- [Person 1]
- [Person 2]

NEXT STEPS:
- [Step 1]
- [Step 2]

Focus on actionable information and specific assignments.
`;
  }
}

module.exports = new SummarizationService();
