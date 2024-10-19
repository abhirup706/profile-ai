const express = require('express');
const JournalEntry = require('../models/JournalEntry');
const AiIntegrationService = require('../services/AiIntegrationService');

const router = express.Router();

// Get all journal entries
router.get('/journals/:userId', async (req, res) => {
    try {
        const entries = await JournalEntry.find({ userId: req.params.userId });
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching journal entries' });
    }
});

// Get a single journal entry
router.get('/journals/entry/:id', async (req, res) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);
        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching journal entry' });
    }
});

// Create a new journal entry
router.post('/journals/entry', async (req, res) => {
    try {
        const { userId, title, content } = req.body;

        const newEntry = new JournalEntry({ userId, title, content });
        await newEntry.save();

        // Call JournalService to create embeddings using the document ID
        try {
            const embeddingResponse = await AiIntegrationService.createJournalEmbedding(
                userId,
                newEntry._id.toString(),  // MongoDB generated document ID
                title,
                content
            );

            if (embeddingResponse.status === 'success') {
                res.status(201).json({
                    message: 'Document uploaded and embeddings created successfully',
                    entry: newEntry
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

    } catch (error) {
        res.status(500).json({ error: 'Error creating journal entry'+error.message });
    }
});

// Update an existing journal entry
router.put('/journals/entry/:id', async (req, res) => {
    try {
        const updatedEntry = await JournalEntry.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        res.status(200).json(updatedEntry);
    } catch (error) {
        res.status(500).json({ error: 'Error updating journal entry' });
    }
});

// Delete a journal entry
router.delete('/journals/entry/:id', async (req, res) => {
    try {
        await JournalEntry.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Journal entry deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting journal entry' });
    }
});

module.exports = router;
