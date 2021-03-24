const express = require('express');

const morgan = require('morgan');

const mongoose = require('mongoose');

const DB = process.env.LOCALDB_URL;

console.log(process.env.LOCALDB_URL);

mongoose
  .connect(DB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connection to the database was successfully');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.send('Hello world');
});

module.exports = app;
