const express = require('express');
const controllers = require('./controllers');
const { errorController } = require('./controllers/errorController');

const app = express();

app.use(express.json());

app.use('/user', controllers.user);

app.use(errorController);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
