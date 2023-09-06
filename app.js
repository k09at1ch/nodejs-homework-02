const mongoose = require('mongoose');
const app = require('./server'); // Підключаємо файл server.js

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
