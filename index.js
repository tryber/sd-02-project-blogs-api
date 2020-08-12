const express = require('express');

const app = express();

const { user } = require('./controller');

app.use(express.json());

app.post('/user', user.postUser)

app.listen(3000, () => console.log('ouvindo porta 3000!'));
