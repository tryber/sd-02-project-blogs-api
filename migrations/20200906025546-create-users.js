module.exports = {
  up: async (queryInterface, Sequelize) => (
    queryInterface.createTable('Users', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      displayName: { allowNull: false, type: Sequelize.STRING },
      email: { allowNull: false, unique: true, type: Sequelize.STRING },
      password: { allowNull: false, type: Sequelize.STRING },
      image: { type: Sequelize.STRING },
    })
  ),

  down: async (queryInterface) => queryInterface.dropTable('Users'),
};
