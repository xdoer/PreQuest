# @prequest/uploader

针对多文件、大文件上传提供了一种便捷的方法，来控制同时进行的任务数量、和文件的切片上传。

## 安装

```bash
npm install @prequest/uploader
```

## 使用

下面演示了一个 60M 的文件，切片成了 6 份，进行 6 次 HTTP 请求，其中队列中同时上传的任务有 3 个。

```tsx
import Uploader from '@prequest/uploader'
import { prequest } from '@prequest/xhr'

const Upload = () => {
  const [fileList, setFileList] = useState<File[]>([])
  const uploader = useRef<Uploader | null>(null)

  useEffect(() => {
    uploader.current = new Uploader({
      chipSize: 10 * 1024 * 1024, // 切片大小,10M
      poolLimit: 3, // 同时进行的任务数量
      customFormData(formData, { idx, file, chunk }) {
        // 要上传数据的 formData
        formData.append('name', file.name)
        formData.append('index', `${idx}`)
        formData.append('chunk', chunk)
        return formData
      },
      request(formData, { idx, file, chunk }) {
        // 上传过程
        return prequest.post('/upload', {
          data: formData,
          onUploadProgress(e) {
            console.log(`${file.name} 的第${idx}个分片，已上传:${e.loaded}`)
          },
        })
      },
    })
  }, [])

  async function onSubmit() {
    try {
      // 上传任务
      await uploader.current.upload(fileList)
    } catch (e) {
      console.log('上传文件失败')
    }
  }

  return (
    <div>
      <input type="file" onChange={e => setFileList(e.target.files)} />
      <button onClick={onSubmit}>上传</button>
    </div>
  )
}
```

## 参数

### 配置参数

| 名称           | 类型                                                             | 默认                                                   | 必填 | 含义                  |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------ | ---- | --------------------- |
| chipSize       | number                                                           | 10 \* 1024 \* 1024                                     | 否   | 切片大小              |
| poolLimit      | number                                                           | 3                                                      | 否   | 同时上传的任务数量    |
| customFormData | (formData: FormData, opt: CallbackOption) => FormData            | 默认会将 name, index, chunk 三个字段添加到 formData 中 | 否   | 定义要上传的 formData |
| request        | (formData: FormData, opt: CallbackOption) => Promise\<Response\> |                                                        | 是   | 定义要上传的请求方法  |

### CallbackOption

| 名称  | 类型   | 含义       |
| ----- | ------ | ---------- |
| idx   | number | 切片的索引 |
| chunk | Blob   | 切片文件   |
| file  | File   | 原始文件   |
