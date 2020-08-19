const GetPosts = (sequelize, DataTypes) => {
  const Post = sequelize.define('BlogPosts', {
    published: DataTypes.DATE,
    updated: DataTypes.DATE,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  });
  return Post;
};

module.exports = GetPosts;
