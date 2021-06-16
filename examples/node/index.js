const { prequest } = require('@prequest/node')

prequest
  .get('http://localhost:8080/api')
  .then((res) => {
    console.log('查看响应', res)
  })
  .catch((e) => {
    console.log('报错啦', e)
  })
