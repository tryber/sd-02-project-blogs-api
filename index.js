const express = require('express');

const app = express();

const { user } = require('./controller');
const errorMid = require('./middlewares/errorMid');
const authMiddleware = require('./middlewares/auth');

app.use(express.json());

app.post('/user', user.postUser);
app.get('/user/:id', authMiddleware, user.getUser);
app.get('/user', authMiddleware, user.getUsers);

app.use(errorMid);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
