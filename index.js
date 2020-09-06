require('dotenv').config();

const bodyParser = require('body-parser');

const express = require('express');

const { error } = require('./middlewares');

const { blogPostRouter, userRouter } = require('./app');

const { BlogPost, User } = require('./env');

const { blogPostModel, userModel } = require('./resource');

const app = express();

app.use(express.json());

app.use(express.static(__dirname + '/images'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/post', blogPostRouter({ BlogPost, blogPostModel }));

app.use('/user', userRouter({ User, userModel }));

app.use(error);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
