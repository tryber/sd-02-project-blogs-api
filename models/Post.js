const Post = (sequelize, DataTypes) => {
  const PostModel = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  }, {
    timestamps: true,
    createdAt: 'published',
    updatedAt: 'updated',
  });

  PostModel.associate = (models) => {
    PostModel.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  };

  return PostModel;
};

module.exports = Post;
