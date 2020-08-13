const createUserModel = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    displayName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
  }, { timestamps: false });

  // User.associate = (models) => {
  //   User.hasMany(models.BlogPost, { as: 'blogPost', foreignKey: 'user_id' });
  // };

  return User;
};

module.exports = createUserModel;
