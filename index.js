const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const middlewares = require('./middlewares');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', controllers.user.login);

const userRouter = express.Router();
app.use('/user', userRouter);

userRouter
  .post('/', middlewares.user.checkCreateFields, controllers.user.createNewUser)
  .get('/', middlewares.user.authUser, controllers.user.getAllUsers)
  .get('/:id', middlewares.user.authUser, controllers.user.getUser)
  .delete('/me', middlewares.user.authUser, controllers.user.deleteUser);

const postRouter = express.Router();
app.use('/post', postRouter);

postRouter
  .post('/', middlewares.user.authUser, controllers.post.createNewPost);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
