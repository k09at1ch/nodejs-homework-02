const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

// parse application/json
app.use(express.json());
// cors
app.use(cors());

const routerApi = require('./api');
app.use('/api', routerApi);

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    data: 'Not found',
  });
});

app.use((err, _, res, __) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  });
});

module.exports = app;
