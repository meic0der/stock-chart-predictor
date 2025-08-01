// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// ルートのインポート
const predictRouter = require('./routes/predict');
const historyRouter = require('./routes/history');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4010;

// ミドルウェアの設定
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 静的ファイルの配信
app.use(express.static(path.join(__dirname, "./public")));

// APIルートの設定
app.use('/api', predictRouter);
app.use('/api', historyRouter);
app.use('/api/auth', authRouter);

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'サーバー内部エラーが発生しました',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404ハンドラー
app.use('*', (req, res) => {
  res.status(404).json({ error: 'エンドポイントが見つかりません' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;