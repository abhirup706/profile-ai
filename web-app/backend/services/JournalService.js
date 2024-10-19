const axios = require('axios');
const baseAiServiceUrl = process.env.BASE_AI_SERVICE_URL || 'http://localhost:8000';
// Function to call external API for embedding generation
async function createJournalEmbedding(userId, documentId, journalTopic, journalText) {
    const url = `${baseAiServiceUrl}/profileai/ai/embeddings/v1/create_embeddings_text/`;

    // Payload for the API
    const payload = {
        user_id: userId,
        document_id: documentId,
        journal_topic: journalTopic,
        journal_text: journalText,
    };

    try {
        // Call the external API
        const response = await axios.post(url, payload);
        return response.data;
    } catch (error) {
        console.error('Error creating journal embedding:', error);
        throw new Error('Failed to create journal embedding');
    }
}

module.exports = {
    createJournalEmbedding,
};
