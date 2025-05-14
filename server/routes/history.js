// server/routes/history.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/history', async (req, res) => {
  const results = await db('histories')
    // .select('id', 'symbol', 'predicted', 'created_at')
    .orderBy('created_at', 'desc')
    .limit(20);

  res.json(results);
});

router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;
  await db('histories').where({ id }).del();
  res.sendStatus(204);
});

// PATCH /api/history/:id
router.patch('/history/:id', async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  if (typeof note !== 'string') {
    return res.status(400).json({ error: 'noteは文字列である必要があります' });
  }

  await db('histories').where({ id }).update({ note });
  res.sendStatus(200);
});

module.exports = router;
