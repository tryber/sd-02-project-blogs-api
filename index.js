const express = require('express');

const bodyParser = require('body-parser');

require('dotenv').config();

const { error } = require('./middlewares');

const { blogPostRouter, userRouter } = require('./app');

const { blogPost, user } = require('./env');

const { blogPostModel, userModel } = require('./resource');

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// app.use('/post', blogPostRouter({ blogPost, blogPostModel }));

app.use('/user', userRouter({ user, userModel }));

app.use(error);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
