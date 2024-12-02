module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'created_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
    await queryInterface.addColumn('Users', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'created_at');
    await queryInterface.removeColumn('Users', 'updated_at');
  },
};
