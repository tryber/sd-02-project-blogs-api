module.exports = {
  up: async (queryInterface) => queryInterface
    .bulkInsert('Users', [
      {
        displayName: 'Marcos Mion',
        email: 'marcos@mion.com',
        password: '123456',
        image: 'http://4.bp.blogspot.com/_YA50adQ-7vQ/S1gfR_6ufpI/AAAAAAAAAAk/1ErJGgRWZDg/S45/brett.png',
      }],
    {}),

  down: async (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
