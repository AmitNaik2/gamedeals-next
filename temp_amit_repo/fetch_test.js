const http = require('http');
http.get('http://127.0.0.0:3000/api/deals', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', data.substring(0, 100)));
}).on('error', err => console.error(err));
