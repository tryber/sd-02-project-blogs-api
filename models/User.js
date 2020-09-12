const UserModel = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      displayName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    { timestamps: false },
  );

  User.associate = (models) => {
    User.hasMany(models.BlogPost, { as: 'blog_posts', foreignKey: 'user_id' });
  };

  return User;
};

module.exports = UserModel;
