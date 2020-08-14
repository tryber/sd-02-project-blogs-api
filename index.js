const express = require('express');
const bodyParser = require('body-parser');

const usersRoute = require('./routes/usersRoutes');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user', usersRoute);

app.listen(3000, () => {
  console.log('App ouvindo a porta 3000!');
});
