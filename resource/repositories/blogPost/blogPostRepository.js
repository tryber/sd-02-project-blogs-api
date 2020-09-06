const { Op } = require('sequelize');

class BlogPostRepository {
  constructor({ BlogPosts, models, data }) {
    this.BlogPosts = BlogPosts;
    this.includeUser = { include: { model: models.Users, as: 'user' } };
    this.data = data;
  }

  async create() {
    return this.BlogPosts.create(this.data);
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
    
    return this.BlogPosts.update(this.data, { where: { id: this.data.id } });
  }
}

module.exports = BlogPostRepository;
