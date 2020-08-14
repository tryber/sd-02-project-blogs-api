const createPostModel = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: DataTypes.STRING,
    title: DataTypes.STRING,
  }, {
    timestamps: true,
    createdAt: 'published',
    updatedAt: 'updated',
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  };

  return Post;
};

module.exports = createPostModel;
