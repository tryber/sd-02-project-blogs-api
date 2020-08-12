require('dotenv').config();

module.exports = {
  development: {
    username: process.env.username,
    password: process.env.password,
    database: 'blogs-api',
    host: 'localhost',
    dialect: 'mysql',
  },
};
