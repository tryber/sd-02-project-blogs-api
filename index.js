require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rescue = require('express-rescue');
const userRouter = require('./routers/userRouter');
const CustomError = require('./services/errorScheme');
const { login } = require('./controllers/userControllers');
const { validateJWT } = require('./middlewares/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRouter);

app.post('/login', rescue(validateJWT), login);

app.use(rescue.from(
  CustomError,
  (err, req, res, next) => {
    const { message: { message, code } } = err;
    console.log(message, code);
    res.status(code).send({ error: message });
    next();
  },
));

app.use((err, req, res, next) => {
  const { message: { message, code } } = err;
  res.status(code).send({ error: { message, code } });
  next();
});

app.listen(3000, () => console.log('ouvindo porta 3000!'));
