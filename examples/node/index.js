const { createPreQuest } = require('@prequest/node')

const instance = createPreQuest()

instance
  .get('/api', {
    protocol: 'http:',
    hostname: 'localhost',
    port: 10000,
    headers: {
      Accept: 'application/json',
    },
  })
  .then((res) => {
    console.log('查看响应', res)
  })
  .catch((e) => {
    console.log('报错啦', e)
  })
