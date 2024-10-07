const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const uploadRoute = require('./routes/uploads');
const journalRoute = require('./routes/journal');

dotenv.config();
const app = express();
app.use(express.json());
app.use('/profileai', uploadRoute);
app.use('/profileai', journalRoute);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));