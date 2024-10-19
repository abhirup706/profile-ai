const express = require('express');
const multer = require('multer');
const Document = require('../models/Document');
const AiIntegrationService = require('../services/AiIntegrationService');



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
        const { userId, documentType, fileType, fileUrl } = req.body;

        //if (!req.file) return res.status(400).send('No file uploaded.');

        const newDocument = new Document({
            userId,
            documentType,
            fileType,
            fileUrl
        });

        await newDocument.save();

        // Call JournalService to create embeddings using the document ID
        try {
            const embeddingResponse = await AiIntegrationService.createDocumentEmbedding(
                userId,
                newDocument._id.toString(),  // MongoDB generated document ID
                fileUrl
            );

            if (embeddingResponse.status === 'success') {
                res.status(201).json({
                    message: 'Document uploaded and embeddings created successfully',
                    entry: newDocument
                });

            }
            else{
                console.error('Error while generating embeddings:', embeddingResponse.message);
                res.status(500).json({ error: 'Document uploaded, but embedding creation failed' });

            }



        } catch (embeddingError) {
            console.error('Error while generating embeddings:', embeddingError);
            res.status(500).json({ error: 'Document uploaded, but embedding creation failed' });
        }
        //res.status(201).json({ message: 'Document uploaded successfully', document: newDocument });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading document' });
    }
});

module.exports = router;
