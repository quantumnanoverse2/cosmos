const https = require('https');
const fs = require('fs');
const path = require('path');

const queries = [
  { q: "europa moon jupiter", file: "europa.jpg" },
  { q: "titan moon saturn cassini", file: "titan.jpg" },
  { q: "ganymede moon jupiter", file: "ganymede.jpg" },
  { q: "enceladus moon saturn cassini", file: "enceladus.jpg" }
];

const downloadDir = path.join(__dirname, 'public', 'objects');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

async function fetchImage(query, filename) {
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const items = json.collection.items;
          if (items.length > 0) {
            const item = items[0];
            // Get the image URL from the item
            const imageHref = item.href; // This is a JSON file containing all sizes
            
            https.get(imageHref, (res2) => {
                let data2 = '';
                res2.on('data', chunk => data2 += chunk);
                res2.on('end', () => {
                    const sizes = JSON.parse(data2);
                    // Find a medium or small size
                    let bestSize = sizes.find(s => s.endsWith('~medium.jpg')) || sizes.find(s => s.endsWith('~small.jpg')) || sizes.find(s => s.endsWith('~orig.jpg'));
                    
                    if (bestSize) {
                        // Change http to https for the download link just in case
                        bestSize = bestSize.replace('http://', 'https://');
                        const fileStream = fs.createWriteStream(path.join(downloadDir, filename));
                        https.get(bestSize, (res3) => {
                            res3.pipe(fileStream);
                            fileStream.on('finish', () => {
                                fileStream.close();
                                console.log(`Downloaded: ${filename}`);
                                resolve();
                            });
                        }).on('error', reject);
                    } else {
                        console.log(`No jpg found for ${filename}`);
                        resolve();
                    }
                });
            }).on('error', reject);
          } else {
            console.log(`No results for ${query}`);
            resolve();
          }
        } catch (e) {
            reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const q of queries) {
    await fetchImage(q.q, q.file);
  }
}

run();
