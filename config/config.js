require('dotenv').config();

module.exports = {
  development: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: 'blogs-api',
    host: 'localhost',
    dialect: 'mysql',
  },
};
