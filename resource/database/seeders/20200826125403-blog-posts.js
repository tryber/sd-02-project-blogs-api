module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert('BlogPosts', [
      {
        id: 1,
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post goes here in this key',
        user_id: 1,
        createdAt: new Date('2011-08-01T19:58:00.000Z'),
        updatedAt: new Date('2011-08-01T19:58:51.947Z'),
      },
    ]);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('BlogPosts', { where: { id: 1 } });
  },
};
