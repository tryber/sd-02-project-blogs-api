const createBlogPostModel = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    title: { type: DataTypes.STRING },
    content: { type: DataTypes.STRING },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' },
    },
    published: { type: DataTypes.DATE },
    updated: { type: DataTypes.DATE },
  });

  BlogPost.associate = (models) => {
    BlogPost.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  };

  return BlogPost;
};

module.exports = createBlogPostModel;
