const { createServer } = require('http');

const app = createServer((req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200, {
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Origin': '*',
      });
      res.end('1');
    }
  }
});

app.listen(10086, () => {
  console.log('server is begin');
});
