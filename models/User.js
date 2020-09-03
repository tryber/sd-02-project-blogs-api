const createUserModel = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    displayName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
  }, { timestamps: false });

  User.associate = (models) => {
    User.hasMany(models.Post, { as: 'post', foreignKey: 'userId' });
  };

  return User;
};

module.exports = createUserModel;
