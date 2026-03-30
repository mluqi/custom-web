'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [
      // 1. Header Section
      {
        category: 'header',
        title: JSON.stringify({
          id: 'Hiburan Terlengkap Untuk Keluarga',
          en: 'Complete Entertainment for Family',
          cn: '家庭的完整娱乐'
        }),
        subtitle: JSON.stringify({
          id: 'Nikmati channel dan platform video streaming terlengkap',
          en: 'Enjoy the most complete streaming video channels and platforms',
          cn: '享受最完整的流媒体视频频道和平台'
        }),
        description: JSON.stringify({
          id: 'Akses ke lebih dari 50+ Channel TV Lokal maupun Internasional dan Live Event lainnya',
          en: 'Access to more than 50+ Local and International TV Channels and other Live Events',
          cn: '访问超过 50 个本地和国际电视频道以及其他现场活动'
        }),
        meta: JSON.stringify({
          header_text: {
            id: 'Akses Hiburan Terlengkap',
            en: 'Access Complete Entertainment',
            cn: '访问完整的娱乐'
          }
        }),
        image: 'hiburan-device.png', // Placeholder, nanti bisa diupdate via admin
        order: 1,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // 2. Streaming Platforms
      {
        category: 'platform',
        title: JSON.stringify({ id: 'Vidio', en: 'Vidio', cn: 'Vidio' }),
        url: 'https://www.vidio.com/',
        meta: JSON.stringify({ color: 'red' }),
        image: 'vidio-logo.png',
        order: 1,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category: 'platform',
        title: JSON.stringify({ id: 'Vision+', en: 'Vision+', cn: 'Vision+' }),
        url: 'https://www.visionplus.id/webclient/',
        meta: JSON.stringify({ color: 'black' }),
        image: 'visionplus-logo.png',
        order: 2,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category: 'platform',
        title: JSON.stringify({ id: 'WeTV', en: 'WeTV', cn: 'WeTV' }),
        url: 'https://wetv.vip/id',
        meta: JSON.stringify({ color: 'blue' }),
        image: 'wetv-logo.png',
        order: 3,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category: 'platform',
        title: JSON.stringify({ id: 'Netflix', en: 'Netflix', cn: 'Netflix' }),
        url: 'https://www.netflix.com/',
        meta: JSON.stringify({ color: 'red' }),
        image: 'netflix-logo.png',
        order: 4,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category: 'platform',
        title: JSON.stringify({ id: 'Spotify', en: 'Spotify', cn: 'Spotify' }),
        url: 'https://open.spotify.com/',
        meta: JSON.stringify({ color: 'green' }),
        image: 'spotify-logo.png',
        order: 5,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // 3. TV Channels (Sample 12 channels)
    for (let i = 1; i <= 12; i++) {
      data.push({
        category: 'channel',
        title: JSON.stringify({ id: `Channel ${i}`, en: `Channel ${i}`, cn: `Channel ${i}` }),
        image: `tv-logo-${i}.png`, // Placeholder
        order: i,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Entertainments', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Entertainments', null, {});
  }
};
