'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'BlogPosts',
      [
        {
          id: 1,
          published: new Date('2011-08-01T19:58:00.000Z'),
          updated: new Date('2011-08-01T19:58:51.947Z'),
          title: 'Latest updates, August 1st',
          content: 'The whole text for the blog post goes here in this key',
          user_id: 1
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('BlogPosts', null, {});
  },
};