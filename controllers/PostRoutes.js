const express = require('express');
const PostController = require('./PostController');
const JwT = require('../middlewares/JwT');

const postRoute = express.Router();

postRoute.post('/', JwT.loginJwt, PostController.newPost);
postRoute.get('/', PostController.getAllPosts);
// postRoute.get('/:id', JwT.loginJwt, UserController.getUserById);
// postRoute.delete('/me', JwT.loginJwt, UserController.deleteUserById);

module.exports = postRoute;
