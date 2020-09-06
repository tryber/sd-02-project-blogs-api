const { getFields } = require('../utils');

class UserRepository {
  constructor({ Users, Models, data }) {
    this.Users = Users;
    this.Models = Models;
    this.data = data;
  }

  async create() {
    return this.Users.create(this.data);
  }

  async find() {
    return this.Users.findByPk(this.data.id);
  }

  async findBy(field) {
    return this.Users.findAll({ where: { [field]: this.data[field] } });
  }

  async list() {
    return this.Users.findAll();
  }

  async remove() {
    return this.Users.destroy({ where: { id: this.data.id } });
  }

  async update() {
    return this.Users.update(getFields(this.data), { where: { id: this.data.id } });
  }
}

module.exports = UserRepository;
