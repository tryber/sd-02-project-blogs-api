module.exports = {
  up: async (queryInterface, Sequelize) => (
    queryInterface.createTable('BlogPosts', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      title: { allowNull: false, type: Sequelize.STRING },
      content: { allowNull: false, type: Sequelize.STRING },
      published: { allowNull: false, type: Sequelize.DATE },
      updated: { allowNull: false, type: Sequelize.DATE },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    })
  ),

  down: async (queryInterface) => queryInterface.dropTable('BlogPosts'),
};
