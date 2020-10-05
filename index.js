const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const loginController = require('./controllers/loginController');

const app = express();

app.use(bodyParser.json());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use('/user', userController.router);

app.use('/login', loginController.router);

app.use('*', (_req, res) => res.status(404).json({
  message: 'Route not exists',
  code: 404,
}));

app.listen(3000, () => console.log('Listen on 3000'));
