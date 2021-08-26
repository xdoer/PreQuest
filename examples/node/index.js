const responseTypesGenerator = require('@prequest/response-types-generator')
const { resolve } = require('path')

async function main() {
  responseTypesGenerator.default({
      parseResponse(res) {
        return res.data
      },
      outPutPath: resolve('./', 'types.ts'),
      data: [
        {
          requestOptions: {
            path: 'https://webspiderr.herokuapp.com/crawl/api?user=xdoer&cid=73b1430d-faa0-44eb-899e-36cf5cbfaec8',
          },
          rootInterfaceName: 'C'
        }
      ]
  })
}

main()
