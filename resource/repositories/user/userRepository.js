const { getFields } = require('../utils');

class UserRepository {
  constructor({ models, data, id }) {
    this.Users = models.Users;
    this.data = data;
    this.id = id;
  }

  async create() {
    return this.Users.create(this.data);
  }

  async find() {
    return this.Users.findByPk(this.id);
  }

  async findBy(field) {
    return this.Users.findAll({ where: { [field]: this.data[field] } });
  }

  async list() {
    return this.Users.findAll();
  }

  async remove() {
    return this.Users.destroy({ where: { id: this.id } });
  }

  async update() {
    return this.Users.update(getFields(this.data), { where: { id: this.id } });
  }
}

module.exports = UserRepository;
