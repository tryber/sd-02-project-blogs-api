module.exports = {
  up: async (queryInterface, _Sequelize) => queryInterface.bulkInsert(
    'Posts',
    [
      {
        id: 2,
        published: '2015-01-01 10:10:10',
        updated: '2015-01-01 10:10:10',
        title: 'Latest updates, August 1st',
        content: 'The whole text for the blog post goes here in this key',
        user_id: 1,
      },
    ],
    {},
  ),

  down: async (queryInterface, _Sequelize) => queryInterface.bulkDelete('Posts', null, {}),
};
