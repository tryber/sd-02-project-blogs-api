function BlogPostsModel(sequelize, DataTypes) {
  const BlogPosts = sequelize.define('BlogPosts', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    published: {
      type: DataTypes.DATE,
      field: 'createdAt',
    },
    updated: {
      type: DataTypes.DATE,
      field: 'updatedAt',
    },
  });

  BlogPosts.associate = (models) => {
    BlogPosts.belongsTo(models.Users, { as: 'user', foreignKey: 'user_id' });
  };

  return BlogPosts;
}

module.exports = BlogPostsModel;
