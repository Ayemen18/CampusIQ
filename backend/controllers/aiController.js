const axios = require('axios');
const ChatMessage = require('../models/ChatMessage');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

exports.queryRAG = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Query cannot be empty' });
    }

    let aiResponse;
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/rag/query`, {
        query: query.trim()
      }, { timeout: 10000 });
      aiResponse = response.data;
    } catch (err) {
      console.warn('AI Service call failed or timed out, returning fallback:', err.message);
      aiResponse = {
        query,
        answer: "CampusIQ Knowledge Base is temporarily handling requests through backup mode. The institutional attendance threshold is 75%, condonation is valid between 65-75%, and placement dream companies require CGPA 7.5+ with zero backlogs.",
        sources: [
          { doc_id: "ATT_001", title: "Minimum Attendance Requirement", source: "attendance_policies.json", page: 1, relevance_score: 0.85, snippet: "Minimum 75% attendance mandatory." }
        ],
        confidence: "Medium",
        category: "Institutional Policies",
        suggested_questions: [
          "What is the minimum attendance required for semester examinations?",
          "What are the placement eligibility criteria?",
          "When are the upcoming examinations?"
        ]
      };
    }

    // Save to user chat history if user is authenticated
    if (req.user) {
      try {
        await ChatMessage.create({
          user: req.user._id,
          query: query.trim(),
          answer: aiResponse.answer,
          category: aiResponse.category || 'General',
          confidence: aiResponse.confidence || 'High',
          sources: aiResponse.sources || []
        });
      } catch (saveErr) {
        console.error('Failed to save chat message:', saveErr.message);
      }
    }

    res.json({
      success: true,
      ...aiResponse
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.semanticSearch = async (req, res) => {
  try {
    const { query, top_k } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/rag/retrieve`, {
        query,
        top_k: top_k || 5
      }, { timeout: 8000 });
      res.json({ success: true, ...response.data });
    } catch (err) {
      res.status(502).json({ success: false, message: 'AI Semantic search service unavailable' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: 1 })
      .limit(50);
    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.clearChatHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ user: req.user._id });
    res.json({ success: true, message: 'Chat history cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAIStatus = async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/rag/status`, { timeout: 4000 });
    res.json({ success: true, ...response.data });
  } catch (err) {
    res.json({
      success: false,
      status: 'offline',
      message: 'Python FastAPI service is not reachable',
      vector_index_active: false
    });
  }
};
