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

const PORT = process.env.PORT || 3000;
const uriDb = process.env.uriDb;

mongoose
  .connect(uriDb, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Database connection successful');
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Database connection failed. Error message: ${err.message}`);
    process.exit(1);
  });

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    data: 'Not found',
  });
});



module.exports = app;
