const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/logs
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Get last 20 logs for the user
    const logs = await prisma.log.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 20
    });

    res.json({
      logs: logs.map(log => ({
        id: log.id,
        model: log.model,
        promptLength: log.promptLength,
        cost: log.cost,
        status: log.status,
        timestamp: log.timestamp
      }))
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

// GET /api/logs/user - Get user info including credits
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        credits: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to retrieve user info' });
  }
});

module.exports = router;