const createPostModel = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: DataTypes.STRING,
    title: DataTypes.STRING,
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    timestamps: false,
    createdAt: 'published',
    updatedAt: 'updated',
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, { as: 'user' });
  };

  return Post;
};

module.exports = createPostModel;
