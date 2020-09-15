module.exports = {
  up: async (queryInterface) => queryInterface
    .bulkInsert('BlogPosts',
      [
        {
          published: new Date('2011-08-01T19:58:00.000Z'),
          updated: new Date('2011-08-01T19:58:51.947Z'),
          title: 'Latest updates, August 1st',
          content: 'The whole text for the blog post goes here in this key',
          userId: 1,
        },
      ],
      {}),

  down: async (queryInterface) => queryInterface.bulkDelete('BlogPosts', null, {}),
};
