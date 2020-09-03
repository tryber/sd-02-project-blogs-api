const createPostsModel = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: { type: DataTypes.STRING },
    content: { type: DataTypes.STRING },
  }, {
    createdAt: 'published',
    updatedAt: 'updated',
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };

  return Post;
};

module.exports = createPostsModel;
