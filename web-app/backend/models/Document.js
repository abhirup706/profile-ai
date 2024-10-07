const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    documentType: { type: String, enum: ['resume', 'cover letter', 'others'], required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true }, // e.g., pdf, word
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
