const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');

const app = express();

app.use(bodyParser.json());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use('/user', userController);

app.listen(3000, () => console.log('Listen on 3000'));
