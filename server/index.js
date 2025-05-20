// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
// const bodyParser = require('body-parser');
const predictRouter = require('./routes/predict');
const historyRouter = require('./routes/history');
const authRouter = require('./routes/auth'); 
const cookieParser = require('cookie-parser');


const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json())
// form からのリクエストを受けるために必要
app.use(express.urlencoded({ extended: true }));
// express でcookieを取得
app.use(cookieParser());

// dist 配信
app.use(express.static(path.join(__dirname, "./public")));

app.use('/api', predictRouter);
app.use('/api', historyRouter);
app.use('/api/auth', authRouter);


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = app;