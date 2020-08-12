const Users = (sequelize, DataTypes) => {
  const User = sequelize.define("Users", {
    displayName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING
  }, { timestamp: false });

  return User;
};

module.exports = Users;