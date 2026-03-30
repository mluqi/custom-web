'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InternetPageContents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      section: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }, // hero, why_us, services, coverage, faq, cta
      title: { type: Sequelize.TEXT }, // JSON {id, en, cn}
      subtitle: { type: Sequelize.TEXT }, // JSON
      description: { type: Sequelize.TEXT }, // JSON
      image: { type: Sequelize.STRING },
      items: { type: Sequelize.TEXT }, // JSON Array (Features, FAQs, Services)
      extra_data: { type: Sequelize.TEXT }, // JSON (Button texts, links, etc)
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('InternetPageContents');
  }
};
