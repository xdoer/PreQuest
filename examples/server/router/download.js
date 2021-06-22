import pkg from 'express'
const { Router } = pkg
import { createReadStream, promises } from 'fs'
import { resolve } from 'path'

const router = Router()

const staticPath = resolve('static')

router
.get('/files', async (req, res) => {
    const fileList = await promises.readdir(staticPath)
    res.send(fileList)
})
.get('/download',(req,res) => {
    const filename = req.query?.filename;

    if(!filename) return res.send('not find file')

    const file = './static/'+ filename;

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename=' + encodeURI(filename),
    });

    const readStream = createReadStream(file)
    readStream.on('data', (chunk) => {
        res.write(chunk, 'binary')
    });
    readStream.on('end', () => {
        res.end();
    })
})
.post('/download',(req,res) => {
    const filename = req.body.filename;

    const file = './static/'+ filename;

    res.writeHead(200, { //设置响应头
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename=' + encodeURI(filename)
    });

    const readStream = createReadStream(file)
    readStream.on('data', (chunk) => {
        res.write(chunk, 'binary')
    });
    readStream.on('end', () => {
        res.end();
    })
})

export { router }
