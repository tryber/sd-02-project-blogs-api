const { Op } = require('sequelize');
const {
  service: { getFields },
} = require('../../../utils');

class BlogPostRepository {
  constructor({ models: { BlogPosts, Users }, data }) {
    this.BlogPosts = BlogPosts;
    this.include = {
      include: [{ model: Users, as: 'user', attributes: { exclude: ['password'] } }],
      attributes: { exclude: ['user_id', 'createdAt', 'updatedAt'] },
    };
    this.data = data;
  }

  async create() {
    return this.BlogPosts.create(getFields(this.data));
  }

  async find() {
    return this.BlogPosts.findByPk(this.data.id, this.include);
  }

  async findBy(name) {
    return this.BlogPosts.findAll({
      where: {
        [Op.or]: [{ title: { [Op.like]: `%${name}%` } }, { content: { [Op.like]: `%${name}%` } }],
      },
    });
  }

  async list() {
    return this.BlogPosts.findAll(this.include);
  }

  async remove() {
    return this.BlogPosts.destroy({ where: { id: this.data.id } });
  }

  async update() {
    return this.BlogPosts.update(getFields(this.data), { where: { id: this.data.id } });
  }
}

module.exports = BlogPostRepository;
