const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', controllers.user);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
