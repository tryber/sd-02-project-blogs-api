const User = (sequelize, DataTypes) => {
  const UserModel = sequelize.define('User', {
    displayName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
  }, { timestamps: false });

  User.associate = (models) => {
    User.hasMany(models.Post, { as: 'post', foreignKey: 'userId' });
  };

  return UserModel;
};

module.exports = User;
