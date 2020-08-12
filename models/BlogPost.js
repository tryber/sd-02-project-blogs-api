const BlogPosts = (sequelize, DataTypes) => {
  const Post = sequelize.define('BlogPosts', {
    published: DataTypes.DATE,
    updated: DataTypes.DATE,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, { updatedAt: 'updated', createdAt: 'published' });
  
  Post.associate = (models) => {
    Post.belongsTo(models.Users, { as: 'user', foreignKey: 'id' });
  };

  return Post;
};

module.exports = BlogPosts;