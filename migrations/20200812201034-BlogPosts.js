module.exports = {
  up: async (queryInterface, Sequelize) => {
    const BlogPosts = queryInterface.createTable('BlogPosts', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      published: { allowNull: false, type: Sequelize.DATE },
      updated: { allowNull: false, type: Sequelize.DATE },
      title: { allowNull: false, type: Sequelize.STRING },
      content: { allowNull: false, type: Sequelize.STRING },
      userId: {
        references: {
          model: 'Users',
          key: 'id',
        },
        type: Sequelize.INTEGER,
      },
    });

    return BlogPosts;
  },

  down: async (queryInterface) => queryInterface.dropTable('BlogPosts'),
};
