const express = require('express');

const app = express();

const { user } = require('./controller');
const errorMid = require('./middlewares/errorMid');

app.use(express.json());

app.post('/user', user.postUser)

app.use(errorMid);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
