const blogPostService = require('./blogPostService');

class BlogPost {
  constructor({ blogPostModel, ...data }) {
    this.blogPostModel = blogPostModel;
    this.data = data;
  }

  async create() {
    return blogPostService.create({ data: this.data, Model: this.blogPostModel });
  }

  async find() {
    return blogPostService.find({ id: this.data.id, Model: this.blogPostModel });
  }

  async list() {
    return blogPostService.list({ Model: this.blogPostModel });
  }

  async remove() {
    return blogPostService.remove({ id: this.data.id, Model: this.blogPostModel });
  }

  async search(name) {
    return blogPostService.search({ name, Model: this.blogPostModel });
  }

  async update() {
    return blogPostService.update({ data: this.data, Model: this.blogPostModel });
  }
}

module.exports = BlogPost;
