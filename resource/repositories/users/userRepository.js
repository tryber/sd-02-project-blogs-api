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
    const fields = Object.keys(this.data)
      .filter((key) => this.data[key])
      .reduce((fields, key) => ({ ...fields, [key]: this.data[key] }), {});
    return this.Users.update(fields, { where: { id: this.id } });
  }
}

module.exports = UserRepository;
