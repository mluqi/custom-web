"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SiteSettings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      group: {
        type: Sequelize.STRING,
        defaultValue: "general", // e.g., 'appearance', 'social', 'contact'
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: "text", // e.g., 'text', 'image', 'color', 'textarea'
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

    // Seed data default agar tidak kosong
    await queryInterface.bulkInsert("SiteSettings", [
      // --- APPEARANCE ---
      {
        key: "accent_color",
        value: "#01eda6",
        group: "appearance",
        type: "color",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "secondary_color",
        value: "#4ffdc3",
        group: "appearance",
        type: "color",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "site_logo",
        value: null,
        group: "appearance",
        type: "image",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // --- GENERAL ---
      {
        key: "footer_description",
        value:
          "PT. Naomi Aurora Teknologi Brand NAT WAIPI adalah perusahaan teknologi yang bergerak di bidang Internet Service Provider (ISP) dan (Jartaplok) dengan izin resmi dari KOMDIGI",
        group: "general",
        type: "textarea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // --- SOCIAL MEDIA ---
      {
        key: "social_instagram",
        value: "https://instagram.com",
        group: "social",
        type: "text",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "social_linkedin",
        value: "https://linkedin.com",
        group: "social",
        type: "text",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "social_facebook",
        value: "https://facebook.com",
        group: "social",
        type: "text",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "social_youtube",
        value: "https://www.youtube.com/channel/UC_-nzPlTvL12IO3VFT03Urw",
        group: "social",
        type: "text",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // --- CONTACT INFO ---
      {
        key: "contact_phone",
        value: "+62 811-578-511",
        group: "contact",
        type: "text",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "contact_email",
        value: "info@naomiaurora.com",
        group: "contact",
        type: "text",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "contact_address",
        value:
          "Jalan Raya, Sungai Purun Besar, Kecamatan Segedong, Kabupaten Mempawah",
        group: "contact",
        type: "textarea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "contact_map_link",
        value:
          "https://maps.google.com/?q=Kabupaten+Mempawah,+Kalimantan+Barat",
        group: "contact",
        type: "text",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // --- CONTACT LOCATIONS (JSON List) ---
      {
        key: "contact_locations",
        value: JSON.stringify([
          {
            title: { id: "Kantor Operational Segedong", en: "Segedong Operational Office", cn: "Segedong 运营办公室" },
            address: { id: "Kab. Mempawah, Kalimantan Barat", en: "Mempawah Regency, West Kalimantan", "cn": "西加里曼丹省曼帕瓦县" },
            mapUrl: "https://www.google.com/maps/embed?origin=mfe&pb=!1m4!2m1!1sPT+NAOMI+AURORA+TEKNOLOGI!5e0!6i14"
          }
        ]),
        group: "contact",
        type: "location_list", // Tipe khusus untuk editor lokasi
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // --- FOOTER LINKS (JSON Format) ---
      {
        key: "footer_business_links",
        value: JSON.stringify([
          { label: "Mengapa Kami", href: "/about-us" },
          { label: "Layanan", href: "/internet" },
          { label: "Internet of Things", href: "/it-solution" },
          { label: "Dukungan", href: "/internet-business" },
          { label: "Update", href: "/blog" },
          { label: "Jadi Mitra", href: "/contact" },
        ]),
        group: "footer_links",
        type: "textarea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "footer_company_links",
        value: JSON.stringify([
          { label: "Perusahaan Kami", href: "/about-us" },
          { label: "Media", href: "/" },
          { label: "CSR", href: "/activity" },
          { label: "Karir", href: "/career", badge: "Hiring" },
        ]),
        group: "footer_links",
        type: "textarea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: "footer_care_links",
        value: JSON.stringify([
          { label: "Kebijakan Privasi", href: "/privacy-policy" },
          { label: "Coverage Area", href: "/internet-home" },
        ]),
        group: "footer_links",
        type: "textarea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SiteSettings");
  },
};
