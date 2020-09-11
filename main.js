require('dotenv').config();

const bodyParser = require('body-parser');

const express = require('express');

const path = require('path');

const middlewares = require('./middlewares');

const { blogPostRouter, userRouter } = require('./app');

const { BlogPost, User } = require('./env');

const { blogPostModel, userModel } = require('./resource');

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/post', blogPostRouter({ BlogPost, blogPostModel, middlewares }));

app.use('/user', userRouter({ User, userModel, middlewares }));

app.use(middlewares.error);

module.exports = app;
