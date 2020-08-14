require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { error, auth } = require('./middleware');

const app = express();


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/login', routes.login);
app.use('/user', routes.users);
app.use('/post', auth, routes.post);

app.use(error);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
