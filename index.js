require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routers = require('./routers');
const errorMiddleware = require('./middlewares/error');

const app = express();

app.use(bodyParser.json());

app.use('/user', routers.user);
app.use('/login', routers.login);
app.use('/post', routers.post);

app.use(errorMiddleware);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
