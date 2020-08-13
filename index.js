require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const middlewares = require('./middlewares');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', controllers.loginUser);
app.post('/user', controllers.createUser);

app.get('/user', middlewares.validateJWT, controllers.getAllUsers);
app.get('/user/:id', middlewares.validateJWT, controllers.getUserById);
app.delete('/user/me', middlewares.validateJWT, controllers.deleteUserById);

app.use(middlewares.promiseErrors);

app.all('*', middlewares.endpointNotFound);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Ouvindo porta ${PORT}!`));
