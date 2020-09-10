const express = require('express');
const userController = require('./controllers/userController');

const app = express();

app.use('/user', userController);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
