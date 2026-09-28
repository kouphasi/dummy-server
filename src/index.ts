import { Hono } from 'hono'
import type { Context } from 'hono'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// 動作確認用エンドポイント: リクエスト/レスポンスの内容を標準出力に出す
// /echo_200, /echo_400, /echo_500 でそれぞれのステータスを返す
const ERROR_MESSAGE = {
  400: 'Bad Request',
  500: 'Internal Server Error',
} as const

const echo = async (c: Context, status: 200 | 400 | 500) => {
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
    ...(status === 200 ? {} : { error: ERROR_MESSAGE[status] }),
    receivedAt: new Date().toISOString(),
    request,
  }

  console.log('--- response ---')
  console.log(JSON.stringify(response, null, 2))

  return c.json(response, status)
}

app.post('/echo_200', (c) => echo(c, 200))
app.post('/echo_400', (c) => echo(c, 400))
app.post('/echo_500', (c) => echo(c, 500))

export default app
