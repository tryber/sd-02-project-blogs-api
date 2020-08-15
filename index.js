const express = require('express');
const bodyParser = require('body-parser');

const user = require('./controllers/UserController');
const endPointController = require('./controllers/endPointController');
const ErrorController = require('./controllers/errorController');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', user);
app.use(ErrorController);

app.all('*', endPointController);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
