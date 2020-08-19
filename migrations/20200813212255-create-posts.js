/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const PostsTable = queryInterface.createTable('Posts', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      content: { allowNull: false, type: Sequelize.STRING },
      title: { allowNull: false, type: Sequelize.STRING },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      published: { allowNull: true, type: Sequelize.DATE },
      updated: { type: Sequelize.DATE, allowNull: false },
    });
    return PostsTable;
  },
  down: async (queryInterface) => queryInterface.dropTable('Users'),
};
