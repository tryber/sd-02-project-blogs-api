const PostsModel = (sequelize, DataTypes) =>
  sequelize.define('BlogPosts', {
    id: DataTypes.INTEGER,
    published: DataTypes.DATE,
    updated: DataTypes.DATE,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  });

module.exports = PostsModel;
