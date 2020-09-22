'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('Posts', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    published: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      allowNull: false,
    },
  }),
  down: async (queryInterface, _Sequelize) => queryInterface.dropTable('Posts'),
};
