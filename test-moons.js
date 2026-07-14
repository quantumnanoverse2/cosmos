const https = require('https');
const urls = [
  'https://upload.wikimedia.org/wikipedia/commons/e/e4/Europa_surface_map.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/87/Titan_surface_map.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/2/27/Ganymede_surface_map.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/b/b3/Enceladus_surface_map.jpg'
];
const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
};
urls.forEach(url => {
  https.get(url, options, (res) => {
    console.log(`${url}: ${res.statusCode}`);
  });
});
