const https = require('https');
const fs = require('fs');
const path = require('path');

const textures = [
  { url: "https://www.solarsystemscope.com/textures/download/2k_sun.jpg", file: "sun.jpg" },
  { url: "https://www.solarsystemscope.com/textures/download/2k_mercury.jpg", file: "mercury.jpg" },
  { url: "https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg", file: "venus.jpg" },
  { url: "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg", file: "earth.jpg" },
  { url: "https://www.solarsystemscope.com/textures/download/2k_mars.jpg", file: "mars.jpg" },
  { url: "https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg", file: "jupiter.jpg" },
  { url: "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg", file: "saturn.jpg" },
  { url: "https://www.solarsystemscope.com/textures/download/2k_uranus.jpg", file: "uranus.jpg" },
  { url: "https://www.solarsystemscope.com/textures/download/2k_neptune.jpg", file: "neptune.jpg" },
  { url: "https://www.solarsystemscope.com/textures/download/2k_moon.jpg", file: "moon.jpg" }
];

const downloadDir = path.join(__dirname, 'public', 'textures');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Referer': 'https://www.solarsystemscope.com/textures/',
  }
};

async function download(t) {
  return new Promise((resolve) => {
    https.get(t.url, options, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(path.join(downloadDir, t.file));
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${t.file}`);
          resolve();
        });
      } else {
        console.log(`Failed ${t.file}: ${res.statusCode}`);
        resolve(); // resolve anyway so we don't hang
      }
    }).on('error', (err) => {
      console.log(`Error ${t.file}: ${err.message}`);
      resolve();
    });
  });
}

async function run() {
  for (const t of textures) {
    await download(t);
  }
}

run();
