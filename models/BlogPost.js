const BlogPostModel = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define(
    'BlogPost',
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
    },
    { createdAt: 'published', updatedAt: 'updated' },
  );

  BlogPost.associate = (models) => {
    BlogPost.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  };

  return BlogPost;
};

module.exports = BlogPostModel;
