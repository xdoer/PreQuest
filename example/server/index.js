const { createServer } = require('http');

const app = createServer((req, res) => {
  res.writeHead(200, {
    'Access-Control-Allow-Credentials': true, //允许后端发送cookie
    'Access-Control-Allow-Origin': req.headers.origin || '*', //任意域名都可以访问,或者基于我请求头里面的域
    'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type', //设置请求头格式和类型
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS', //允许支持的请求方式
    // 'Content-Type': 'application/text; charset=utf-8', //默认与允许的文本格式json和编码格式
  });

  if (req.method === 'OPTIONS') {
    res.end();
  }

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

app.listen(10000, () => {
  console.log('server is begin');
});
