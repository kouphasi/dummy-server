To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

## Cloudflare Workers

```sh
pnpm install
pnpm cf:dev      # wrangler dev (http://localhost:8787)
pnpm deploy      # wrangler deploy --minify（初回は `pnpm exec wrangler login` が必要）
pnpm cf-typegen  # wrangler.jsonc 変更後に型を再生成
```
