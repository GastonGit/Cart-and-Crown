"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("user", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      // This might not actually do anything here
      validate: {
        isLowercase: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("user", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
      validate: {
        isLowercase: false,
      },
    });
  },
};
