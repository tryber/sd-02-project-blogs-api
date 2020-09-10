const express = require('express');
const { getUsers } = require('../models/userModel');

const router = express.Router();

router.get('/', getUsers);
