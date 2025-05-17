// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const predictRouter = require('./routes/predict');
const historyRouter = require('./routes/history');


const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// dist 配信
app.use(express.static(path.join(__dirname, "./public")));

app.use('/api', predictRouter);
app.use('/api', historyRouter);


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
