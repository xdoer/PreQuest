const { createServer } = require('http');

const app = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST,GET');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200);
      res.end('1');
    }
  }
});

app.listen(10086, () => {
  console.log('server is begin');
});
