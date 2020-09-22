const express = require('express');
const userRoutes = require('./routes/userRoutes');
const blogPostsRoutes = require('./routes/blogPostsRoutes');
const loginRoutes = require('./routes/loginRoutes');
const { errorController } = require('./controllers/errorController');

const app = express();

app.use(express.json());

app.use('/user', userRoutes);

app.use('/post', blogPostsRoutes);

app.use('/login', loginRoutes);

app.use(errorController);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
