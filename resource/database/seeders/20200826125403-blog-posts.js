module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('BlogPosts', []);
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('BlogPosts', null, {});
  },
};
