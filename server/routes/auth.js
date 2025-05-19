const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');
const path = require('path');

const sessions = {};

// パスワードのハッシュ化
function hashPassword(password, salt) {
  return crypto
    .createHash('sha256')
    .update(salt + password)
    .digest('hex');
}

// セッションIDの生成
function createSession(username) {
  const sessionId = crypto.randomBytes(16).toString('hex');
  sessions[sessionId] = { username, createdAt: Date.now() };
  return sessionId;
}

// ユーザー登録
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const salt = crypto.randomBytes(6).toString('hex');
  const hashedPassword = hashPassword(password, salt);

  try {
    await db('users').insert({
      username,
      email,
      password: hashedPassword,
      salt: salt, // ← saltも保存するカラムをusersテーブルに用意すること
    });
    res.status(201).json({ message: 'ユーザー登録成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '登録に失敗しました' });
  }
});

// ログイン
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db('users').where({ username }).first();

    if (!user) {
      return res.status(401).json({ error: 'ユーザー名が存在しません' });
    }

    const inputHash = hashPassword(password, user.salt);
    if (inputHash !== user.password) {
      return res.status(401).json({ error: 'パスワードが間違っています' });
    }

    const sessionId = createSession(username);
    console.log("🚀 ~ router.post ~ sessionId:", sessionId)
    res.cookie('sessionId', sessionId, { httpOnly: true });
    res.json({ message: 'ログイン成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ログインエラー' });
  }
});

// ログアウト
router.post('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  console.log("🚀 ~ router.post ~ sessionId:", sessionId)
  delete sessions[sessionId];
  res.clearCookie('sessionId');
  res.json({ message: 'ログアウト成功' });
});


module.exports = router;
