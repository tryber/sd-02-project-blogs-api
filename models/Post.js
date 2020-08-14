const createPostModel = (sequelize, DataTypes) => {
  const Post = sequelize.define('Blog_post', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
  }, {
    createdAt: 'published',
    updatedAt: 'updated',
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };

  return Post;
};

module.exports = createPostModel;
