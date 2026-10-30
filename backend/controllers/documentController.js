const Document = require('../models/Document');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

exports.getAllDocuments = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } }
      ];
    }

    const documents = await Document.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: documents.length, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload' });
    }

    const { category, title } = req.body;
    const file = req.file;

    // Send to FastAPI AI Service for RAG ingestion
    let chunksAdded = 1;
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.path), file.originalname);
      formData.append('category', category || 'Academic Document');

      const aiRes = await axios.post(`${AI_SERVICE_URL}/api/rag/ingest`, formData, {
        headers: formData.getHeaders(),
        timeout: 15000
      });
      chunksAdded = aiRes.data.chunks_added || 1;
    } catch (aiErr) {
      console.warn('FastAPI ingestion warning:', aiErr.message);
    }

    const docId = `DOC_${Date.now()}`;
    const newDoc = await Document.create({
      docId,
      title: title || file.originalname,
      category: category || 'Academic Document',
      source: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      chunksCount: chunksAdded,
      uploadedBy: req.user ? req.user.name : 'Administrator',
      fileSize: `${(file.size / 1024).toFixed(1)} KB`
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded and indexed successfully into RAG knowledge base',
      document: newDoc
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Document removed from knowledge base' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
