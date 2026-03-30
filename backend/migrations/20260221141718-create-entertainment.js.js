"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Entertainments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      category: {
        type: Sequelize.STRING, // 'header', 'platform', 'channel'
        allowNull: false,
      },
      title: {
        type: Sequelize.TEXT, // JSON for i18n
      },
      subtitle: {
        type: Sequelize.TEXT, // JSON for i18n
      },
      description: {
        type: Sequelize.TEXT, // JSON for i18n
      },
      image: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      meta: {
        type: Sequelize.TEXT, // JSON for extra data (color, header_text, etc)
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Entertainments");
  },
};
