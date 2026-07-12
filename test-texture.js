const https = require('https');
const fs = require('fs');

const url = "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg";
const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Referer': 'https://www.solarsystemscope.com/textures/',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
  }
};

https.get(url, options, (res) => {
  console.log('Status:', res.statusCode);
  if (res.statusCode === 200) {
    const file = fs.createWriteStream('test-earth.jpg');
    res.pipe(file);
    file.on('finish', () => console.log('Downloaded test-earth.jpg'));
  } else {
    console.log('Headers:', res.headers);
  }
});
