const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const CREDIT_COST = 5;

// POST /v1/chat/completions
router.post('/chat/completions', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const { model, prompt } = req.body;

    // Validate authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const apiKey = authHeader.split(' ')[1];

    if (!apiKey) {
      return res.status(401).json({ error: 'API key is required' });
    }

    // Validate request body
    if (!model || !prompt) {
      return res.status(400).json({ error: 'Model and prompt are required' });
    }

    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt must be a non-empty string' });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({ error: 'Prompt is too long (max 5000 characters)' });
    }

    // Find all API keys and validate
    const allApiKeys = await prisma.apiKey.findMany({
      include: {
        user: true
      }
    });

    let validUser = null;

    for (const storedKey of allApiKeys) {
      const isValid = await bcrypt.compare(apiKey, storedKey.keyHash);
      if (isValid) {
        validUser = storedKey.user;
        break;
      }
    }

    if (!validUser) {
      // Log failed attempt
      await prisma.log.create({
        data: {
          userId: 'unknown',
          model: model || 'unknown',
          promptLength: prompt?.length || 0,
          cost: 0,
          status: 'error'
        }
      }).catch(() => {}); // Ignore log errors for invalid keys

      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Check if user has enough credits
    if (validUser.credits < CREDIT_COST) {
      // Log insufficient credits attempt
      await prisma.log.create({
        data: {
          userId: validUser.id,
          model,
          promptLength: prompt.length,
          cost: 0,
          status: 'error'
        }
      });

      return res.status(402).json({ 
        error: 'Insufficient credits',
        creditsRequired: CREDIT_COST,
        creditsAvailable: validUser.credits
      });
    }

    // Deduct credits
    const updatedUser = await prisma.user.update({
      where: { id: validUser.id },
      data: {
        credits: {
          decrement: CREDIT_COST
        }
      }
    });

    // Create log entry
    await prisma.log.create({
      data: {
        userId: validUser.id,
        model,
        promptLength: prompt.length,
        cost: CREDIT_COST,
        status: 'success'
      }
    });

    // Generate mock response
    const responseId = `chatcmpl-${uuidv4()}`;
    const reply = `Echo: ${prompt}`;

    res.json({
      id: responseId,
      model,
      reply,
      credits_remaining: updatedUser.credits
    });

  } catch (error) {
    console.error('AI completion error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = router;