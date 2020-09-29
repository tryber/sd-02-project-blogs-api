const express = require('express');

const app = express();

const {
  users,
  posts,
} = require('./routes');

app.use(express.json());

app.use('/user', users);
app.use('/post', posts);

module.exports = app;

app.listen(3001, () => console.log('ouvindo porta 3000!'));
