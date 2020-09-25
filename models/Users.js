const createUserModel = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    displayName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {
    timestamps: false,
  });

  Users.associate = (models) => {
    Users.hasMany(models.BlogPosts, { as: 'posts', foreignKey: 'userId' });
  };

  return Users;
};

module.exports = createUserModel;
