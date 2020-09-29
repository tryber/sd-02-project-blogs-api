require('dotenv').config();

const rescue = require('express-rescue');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { CommonValidationError } = require('./services/errorScheme');
const userRouter = require('./routers/userRouter');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRouter);

app.use(rescue.from(CommonValidationError, (err, req, res, next) => {
  const { message, status } = err;
  res.status(status).send({ error: { message, code: status } });
  next();
}));

app.use((err, req, res, next) => {
  const { message } = err;
  res.status(500).send({ error: { message, code: 500 } });
  next();
});

app.listen(3000, () => console.log('ouvindo porta 3000!'));
