const blogPostService = require('./blogPostService');

class BlogPost {
  constructor({ blogPostModel, data }) {
    this.blogPostModel = blogPostModel;
    this.data = data;
  }

  async create() {
    return blogPostService.create({ data: this.data, model: this.blogPostModel });
  }

  async find() {
    return blogPostService.find({ id: this.data.id, model: this.blogPostModel });
  }

  async list() {
    return blogPostService.list({ model: this.blogPostModel });
  }

  async remove() {
    return blogPostService.remove({ id: this.data.id, model: this.blogPostModel });
  }

  async search(name) {
    return blogPostService.search({ name, model: this.blogPostModel });
  }

  async update() {
    return blogPostService.update({ data: this.data, model: this.blogPostModel });
  }
}

module.exports = BlogPost;
