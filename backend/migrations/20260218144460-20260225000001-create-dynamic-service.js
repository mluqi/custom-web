'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DynamicServices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      title: { type: Sequelize.TEXT }, // JSON {id, en, cn}
      subtitle: { type: Sequelize.TEXT }, // JSON
      description: { type: Sequelize.TEXT }, // JSON (Main description)
      image: { type: Sequelize.STRING }, // Main/Hero Image
      secondary_image: { type: Sequelize.STRING }, // Content Image
      template: { 
        type: Sequelize.STRING, 
        defaultValue: 'template1' // template1 (Wifi), template2 (Business), template3 (Simple)
      },
      features: { type: Sequelize.TEXT }, // JSON Array [{title, desc}]
      content: { type: Sequelize.TEXT }, // JSON {p1, p2, p3, etc}
      cta_text: { type: Sequelize.TEXT }, // JSON
      cta_link: { type: Sequelize.STRING },
      seo_title: { type: Sequelize.TEXT }, // JSON
      seo_description: { type: Sequelize.TEXT }, // JSON
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DynamicServices');
  }
};
