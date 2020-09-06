const blogPostService = require('./blogPostService');

class BlogPost {
  constructor({ blogPostModel, id, ...data }) {
    this.blogPostModel = blogPostModel;
    this.data = data;
    this.id = id;
  }

  async create() {
    return blogPostService.create({ data: this.data, Model: this.blogPostModel });
  }

  async find() {
    return blogPostService.find({ id: this.id, Model: this.blogPostModel });
  }

  async list() {
    return blogPostService.list({ Model: this.blogPostModel });
  }

  async remove() {
    return blogPostService.remove({ id: this.id, Model: this.blogPostModel });
  }

  async search(name) {
    return blogPostService.search({ name, Model: this.blogPostModel });
  }

  async update() {
    return blogPostService.update({ data: this.data, id: this.id, Model: this.blogPostModel });
  }
}

module.exports = BlogPost;
