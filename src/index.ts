import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// 動作確認用エンドポイント: リクエスト/レスポンスの内容を標準出力に出す
// 返すステータスを切り替えたいときは、下の STATUS / ERROR_MESSAGE のコメントアウトを入れ替える
const STATUS = 200 as 200 | 400 | 500
// const STATUS = 400 as 200 | 400 | 500
// const STATUS = 500 as 200 | 400 | 500

const ERROR_MESSAGE: Record<number, string> = {
  400: 'Bad Request',
  500: 'Internal Server Error',
}

app.post('/echo', async (c) => {
  const contentType = c.req.header('content-type') ?? ''
  const rawBody = await c.req.text()

  let body: unknown = rawBody
  if (contentType.includes('application/json') && rawBody) {
    try {
      body = JSON.parse(rawBody)
    } catch {
      // JSON としてパースできない場合は生の文字列のまま扱う
    }
  }

  const request = {
    method: c.req.method,
    url: c.req.url,
    path: c.req.path,
    query: c.req.query(),
    headers: c.req.header(),
    body,
  }

  console.log('--- request ---')
  console.log(JSON.stringify(request, null, 2))

  const response = {
    ...(STATUS === 200 ? {} : { error: ERROR_MESSAGE[STATUS] }),
    receivedAt: new Date().toISOString(),
    request,
  }

  console.log('--- response ---')
  console.log(JSON.stringify(response, null, 2))

  return c.json(response, STATUS)
})

export default app
