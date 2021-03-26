const express = require('express');

const morgan = require('morgan');

const mongoose = require('mongoose');

const userRoutes = require('./routes/userAuth');

const DB = process.env.LOCALDB_URL;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

console.log(process.env.LOCALDB_URL);

mongoose
  .connect(DB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connection to the database was successfully');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(morgan('combined'));

app.use('/api/v1/users', userRoutes);

module.exports = app;
