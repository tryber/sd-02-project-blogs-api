const express = require('express');

const app = express();

const { user, blog } = require('./controller');
const errorMid = require('./middlewares/errorMid');
const authMiddleware = require('./middlewares/auth');

app.use(express.json());

app.post('/user', user.postUser);
app.get('/user/:id', authMiddleware, user.getUser);
app.delete('/user/me', authMiddleware, user.deleteUser);
app.get('/user', authMiddleware, user.getUsers);

app.post('/login', user.login);

app.get('/post/:id', blog.getOnePost);
app.put('/post/:id', authMiddleware, blog.putPost);
app.post('/post', authMiddleware, blog.createPost);
app.get('/post', blog.getAllPosts);

app.use(errorMid);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
