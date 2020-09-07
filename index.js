require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers');

const app = express();

app.use(bodyParser.json());

app.use('/user', controllers.user);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
