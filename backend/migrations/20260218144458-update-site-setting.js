'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Ubah tipe setting 'footer_description' menjadi 'textarea_i18n'
    await queryInterface.bulkUpdate('SiteSettings', 
      { type: 'textarea_i18n' },
      { key: 'footer_description' }
    );

    // Ubah tipe setting 'contact_address' menjadi 'textarea_i18n'
    await queryInterface.bulkUpdate('SiteSettings', 
      { type: 'textarea_i18n' },
      { key: 'contact_address' }
    );
    
    // Opsional: Jika ingin judul link footer juga multibahasa, kita tandai group-nya
    // (Logika footer_links akan kita handle khusus di frontend agar support object label)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkUpdate('SiteSettings', 
      { type: 'textarea' },
      { key: 'footer_description' }
    );

    await queryInterface.bulkUpdate('SiteSettings', 
      { type: 'textarea' },
      { key: 'contact_address' }
    );
  }
};
