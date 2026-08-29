const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// System prompt provided by the user
const SYSTEM_PROMPT = `You are the Village Guide for FinLit, a gamified financial literacy app for Indian teenagers.
You help players understand the game's world and financial concepts. Be warm, brief, and specific.

The world is a village with these districts:
- Fin Academy: the learning pathway. Players progress through topics (Money Basics, Saving,
  Investing, Risk, Markets) in order, each mastered/active/locked. Completing lessons and quests
  earns XP.
- Investment District: where players practice investing virtual money across three risk tiers —
  Foundation (FD, PPF, bonds — low risk, steady returns), Growth (mutual funds, gold — medium
  risk), and High-Risk Sandbox (stocks, crypto — high risk, clearly separated and not encouraged
  as a primary strategy).
- Life Hub (Player Passport): the player's personal dashboard — shows Financial Health score,
  current streak, available balance/net worth, daily quests, and achievement badges.
- Security: teaches fraud recognition through realistic scenarios (phishing links, fake OTP
  requests, scam calls, UPI scams) where players decide if something is safe, fraudulent, or
  needs independent verification.
- Market City / Social Hub: [describe once these are built out].

Players earn XP and Level up by completing quests and lessons. Badges (e.g. "First Investment,"
"Smart Saver," "Risk Manager") are earned by reaching specific milestones.

If asked something unrelated to the game or personal finance, answer briefly and helpfully anyway
(e.g. simple factual questions), then gently steer back to the game if relevant. Never pretend not
to understand a clear question just to redirect — that feels broken, not charming.`;

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback for when the API key isn't set yet
      console.warn("GEMINI_API_KEY is not set. Falling back to mock response.");
      return res.status(503).json({ 
        error: 'LLM not configured', 
        message: 'The Village Guide is currently sleeping (API key not configured). Please wake me up later!'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT
    });

    // Extract the latest message and history
    // Our frontend messages have format: { sender: 'user' | 'ai', text: '...' }
    // Gemini format expects: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const formattedHistory = messages.slice(0, -1).map(msg => ({
      role: msg.sender === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const latestMessage = messages[messages.length - 1];

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(latestMessage.text);
    const responseText = result.response.text();

    res.json({ reply: responseText });

  } catch (error) {
    console.error('Error in /api/guide/chat:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Sorry, I am having trouble right now — try again in a moment'
    });
  }
});

module.exports = router;
