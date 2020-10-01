require('dotenv').config();

module.exports = {
  development: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: 'trybe-api-blogs',
    host: 'localhost',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: 'backendisdangerous',
    database: 'trybe-api-blogs',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
