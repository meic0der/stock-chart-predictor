// server/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const predictRouter = require('./routes/predict');
const historyRouter = require('./routes/history');



const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', predictRouter);
app.use('/api', historyRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
