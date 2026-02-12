const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Generate a random API key
const generateApiKey = () => {
  return `sk-${uuidv4().replace(/-/g, '')}`;
};

// POST /api/keys/generate
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Generate new API key
    const apiKey = generateApiKey();
    const keyHash = await bcrypt.hash(apiKey, 10);
    const keyPrefix = apiKey.substring(0, 8); // "sk-1234"
    const keySuffix = apiKey.substring(apiKey.length - 4); // last 4 chars

    // Delete existing API key if any
    await prisma.apiKey.deleteMany({
      where: { userId }
    });

    // Create new API key
    const newApiKey = await prisma.apiKey.create({
      data: {
        userId,
        keyHash,
        keyPrefix,
        keySuffix
      }
    });

    res.json({
      message: 'API key generated successfully',
      apiKey: apiKey, // Only send plain key once
      maskedKey: `${keyPrefix}...${keySuffix}`
    });
  } catch (error) {
    console.error('Generate API key error:', error);
    res.status(500).json({ error: 'Failed to generate API key' });
  }
});

// GET /api/keys/current
router.get('/current', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const apiKey = await prisma.apiKey.findUnique({
      where: { userId }
    });

    if (!apiKey) {
      return res.json({ 
        hasKey: false,
        maskedKey: null 
      });
    }

    res.json({
      hasKey: true,
      maskedKey: `${apiKey.keyPrefix}...${apiKey.keySuffix}`,
      createdAt: apiKey.createdAt
    });
  } catch (error) {
    console.error('Get API key error:', error);
    res.status(500).json({ error: 'Failed to retrieve API key' });
  }
});

module.exports = router;