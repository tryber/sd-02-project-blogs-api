const userService = require('./userService');

class User {
  constructor({ userModel, data }) {
    this.userModel = userModel;
    this.data = data;
  }
}
