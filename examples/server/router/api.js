import { Router } from 'express'
import { prequest } from '@prequest/node'

const router = Router()

const token = '' + Date.now()

router
.get('/token', async function (req, res) {
  await sleep()
  res.send(token)
})
.get('/api', async function (req, res) {
  // const data = await prequest('https://webspiderr.herokuapp.com/crawl/api?user=xdoer&cid=73b1430d-faa0-44eb-899e-36cf5cbfaec8')
  res.send('data')
})
.get('/error-retry', async function (req, res) {
  if(Math.random() > 0.5) {
    res.send('success')
  } else {
    res.sendStatus(401)
  }
})
.post('/error-retry', async function (req, res) {
  if(Math.random() > 0.5) {
    res.send('success')
  } else {
    res.sendStatus(401)
  }
})

export { router }

const data = {
  "state": true,
  "time": "5/23/2021, 5:16:13 AM",
  "data": [
    {
      "title": "袁隆平同志遗体送别仪式明天10时在长沙市明阳山殡仪馆举行",
      "content": "湖南日报·新湖南客户端5月23日消息，记者今天从袁隆平同志治丧办公室获悉，“共和国勋章”获得者、“改革先锋”称号获得者、中国工程院院士、国家杂交水稻工程技术研究中心主任、第六至第十二届全国政协常委、第六至第十一届湖南省政协副主席袁隆平同志，因病医治无效，于2021年5月22日13时07分在长沙逝世，享年91岁。兹定于2021年5月24日（星期一）上午10:00在长沙市明阳山殡仪馆铭德厅举行袁隆平同志遗体送别仪式。（原题为《袁隆平同志遗体送别仪式明天举行》）(本文来自澎湃新闻，更多原创资讯请下载“澎湃新闻”APP)"
    },
  ]
}

const sleep = (t = 3000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(void 0)
    }, t)
  })
}
