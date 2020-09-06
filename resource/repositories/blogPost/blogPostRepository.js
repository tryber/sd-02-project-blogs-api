const { Op } = require('sequelize');
const {
  service: { getFields },
} = require('../../../utils');

class BlogPostRepository {
  constructor({ models, data }) {
    this.BlogPosts = models.BlogPosts;
    this.includeUser = { include: { model: models.Users, as: 'user' } };
    this.data = data;
  }

  async create() {
    return this.BlogPosts.create(getFields(this.data));
  }

  async find() {
    return this.BlogPosts.findByPk(this.data.id, this.includeUser);
  }

  async findBy(name) {
    return this.BlogPosts.findAll({
      where: {
        [Op.or]: [{ title: { [Op.substring]: name } }, { content: { [Op.substring]: name } }],
      },
    });
  }

  async list() {
    return this.BlogPosts.findAll(this.includeUser);
  }

  async remove() {
    return this.BlogPosts.destroy({ where: { id: this.data.id } });
  }

  async update() {
    return this.BlogPosts.update(getFields(this.data), { where: { id: this.data.id } });
  }
}

module.exports = BlogPostRepository;
