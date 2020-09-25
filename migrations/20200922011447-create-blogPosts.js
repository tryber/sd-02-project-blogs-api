module.exports = {
  up: async (queryInterface, Sequelize) => {
    const BlogPostsTable = queryInterface.createTable('BlogPosts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: { allowNull: false, type: Sequelize.STRING },
      content: { allowNull: false, type: Sequelize.STRING },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      published: { allowNull: true, type: Sequelize.DATE },
      updated: { allowNull: false, type: Sequelize.DATE },
    });
    return BlogPostsTable;
  },

  down: async (queryInterface) => queryInterface.dropTable('BlogPosts'),
};
