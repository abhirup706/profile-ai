const express = require('express');
const multer = require('multer');
const Document = require('../models/Document');

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Upload document API
router.post('/upload', upload.single('document'), async (req, res) => {
    try {
        const { userId, documentType, fileType } = req.body;

        if (!req.file) return res.status(400).send('No file uploaded.');

        const newDocument = new Document({
            userId,
            documentType,
            fileType,
            fileUrl: req.file.path,
        });

        await newDocument.save();
        res.status(201).json({ message: 'Document uploaded successfully', document: newDocument });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading document' });
    }
});

module.exports = router;
