module.exports = {
  up: async (queryInterface, _Sequelize) => queryInterface.bulkInsert(
    'Posts',
    [
      {
        id: 2,
        published: new Date('2015-01-01 10:10:10'),
        updated: new Date('2011-08-01T19:58:00.000Z'),
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post goes here in this key',
        user_id: 1,
      },
    ],
    {},
  ),

  down: async (queryInterface, _Sequelize) => queryInterface.bulkDelete('Posts', null, {}),
};
