const https = require('https');

https.get('https://images-api.nasa.gov/search?q=pluto%20global%20map&media_type=image', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    if (json.collection.items.length > 0) {
      json.collection.items.slice(0, 5).forEach(item => {
        console.log(item.data[0].title);
        console.log(item.href);
      });
    }
  });
});
