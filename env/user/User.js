const userService = require('./userService');

class User {
  constructor({ userModel, data }) {
    this.userModel = userModel;
    this.data = data;
  }

  async create() {
    return userService.create({ data: this.data, model: this.userModel });
  }

  async find() {
    return userService.find({ id: this.data.id, model: this.userModel });
  }

  async list() {
    return userService.list({ model: this.userModel });
  }

  async login() {
    return userService.login({
      email: this.data.email,
      password: this.data.password,
      model: this.userModel,
    });
  }

  async remove() {
    return userService.remove({ id: this.data.id, model: this.userModel });
  }

  async update() {
    return userService.update({ data: this.data, model: this.userModel });
  }
}

module.exports = User;
