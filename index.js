const express = require('express');
const bodyParser = require('body-parser');

const usersRoute = require('./routes/usersRoutes');
const postsRoute = require('./routes/postsRoutes');
const { login } = require('./controllers/authenticatorController');
const { errorController } = require('./controllers/errorController');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user', usersRoute);
app.use('/post', postsRoute);
app.post('/login', login);

app.use(errorController);

app.listen(3000, () => {
  console.log('App ouvindo a porta 3000!');
});
