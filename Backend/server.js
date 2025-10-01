// /backend/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const quotesRoutes = require('./routes/quotes');
const interviewQuestionsRoutes = require('./routes/interviewQuestions');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '4mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api', quotesRoutes);
// app.use('/api/books', quotesRoutes);
app.use('/api/interview-questions', interviewQuestionsRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log('Server running on port', PORT));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}

start();
