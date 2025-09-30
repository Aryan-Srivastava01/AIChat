// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());

// Allow requests from React frontend
app.use(cors());

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Health check
app.get('/', (req, res) => {
  res.send('Server is working');
});

// Chat generation endpoint
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'x-ai/grok-4-fast:free',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const message = response.data?.choices?.[0]?.message;

    console.log("Full message object:", JSON.stringify(message, null, 2));

    const text = Array.isArray(message?.content)
      ? message.content.map((c) => c.text || '').join('\n')
      : message?.content?.text || message?.content || '';

    if (!text) {
      return res.status(500).json({ error: 'No text returned from API' });
    }

    res.json({ text });
  } catch (error) {
    console.error('Error generating chat:', error.response?.data || error.message);

    if (error.response?.status === 402) {
      return res.status(402).json({ error: 'Insufficient credits in OpenRouter account.' });
    }

    res.status(500).json({ error: 'Failed to generate chat' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
