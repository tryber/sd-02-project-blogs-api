const express = require('express');

const app = express();

const {
  users,
} = require('./routes');

app.use(express.json());

app.use('/api', users);

module.exports = app;

app.listen(3001, () => console.log('ouvindo porta 3000!'));
