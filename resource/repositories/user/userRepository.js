const {
  service: { getFields },
} = require('../../../utils');

class UserRepository {
  constructor({ models, data }) {
    this.Users = models.Users;
    this.data = data;
  }

  async create() {
    return this.Users.create(getFields(this.data));
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
