module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      displayName: { allowNull: false, type: Sequelize.STRING },
      email: { unique: true, allowNull: false, type: Sequelize.STRING },
      password: { allowNull: false, type: Sequelize.STRING },
      image: { allowNull: true, type: Sequelize.STRING },
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};
