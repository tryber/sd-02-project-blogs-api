module.exports = {
  up: async (queryInterface) => {
    queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 1,
          displayName: 'Julio Cezar',
          email: 'jctaraujo@hotmail.com',
          password: '123456',
          image: 'http://imagem.com',
        },
      ],
      { timestamps: false },
    );
  },

  down: async (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
