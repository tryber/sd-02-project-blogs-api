require('dotenv').config();

module.exports = {
  development: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: 'trybe-api-blogs',
    host: 'localhost',
    dialect: 'mysql',
  },
};
