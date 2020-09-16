module.exports = {
  up: async (queryInterface, _Sequelize) =>
    queryInterface.bulkInsert(
      'Users',
      [
        {
          displayName: 'Guilherme Crespo',
          email: 'gui@gui.com',
          password: '123456',
          image: 'https://thetechhacker.com/wp-content/uploads/2017/01/What-is-GUI-Graphical-user-Interface.jpg',
        },
      ],
      {},
    ),
  down: async (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
