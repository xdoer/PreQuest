const { createServer } = require('http');

const app = createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Encoding': 'utf-8',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
  });

  if (req.method === 'GET') {
    if (/\/api\??/i.test(req.url)) {
      res.end('1');
    }
  }

  if (req.method === 'POST') {
    if (/\/api\??/i.test(req.url)) {
      res.end('1');
    }
  }
});

app.listen(10086, () => {
  console.log('server is begin');
});
