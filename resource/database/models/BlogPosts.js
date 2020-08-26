function BlogPostsModel(sequelize, DataTypes) {
  const BlogPosts = sequelize.define('BlogPosts', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      field: 'published',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated',
    },
  });

  BlogPosts.associate = (models) => {
    BlogPosts.belongsTo(models.BlogPosts, { foreignKey: 'user_id' });
  };

  return BlogPosts;
}

module.exports = BlogPostsModel;
