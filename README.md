# 帧帧 FrameFrame

> 给素材，给需求，出分镜，出脚本，出视频。

AI 短视频广告分镜生成器。上传商品素材，AI 生成分镜参考图 + 文案脚本，确认后直接出视频。

## Quick Start

```bash
pnpm install
pnpm dev
```

打开 http://localhost:5173，进入 `/settings` 配置你的 API Key。

## API 接入

纯前端应用，所有 AI 请求从浏览器直接发出。Key 只存 localStorage，不经过任何服务器。

### LLM（脚本生成）

兼容 OpenAI Chat Completions 格式：

| 服务 | Base URL | Model |
|------|----------|-------|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o` |
| Claude (proxy) | 你的代理地址 | `claude-sonnet-4-20250514` |
| Deepseek | `https://api.deepseek.com/v1` | `deepseek-chat` |

### Image（图片生成）

兼容 OpenAI Images API：

| 服务 | Base URL | Model |
|------|----------|-------|
| OpenAI | `https://api.openai.com/v1` | `gpt-image-1` |
| OpenAI | `https://api.openai.com/v1` | `dall-e-3` |

### Video（视频生成）

各家格式不同，在 `src/lib/video.ts` 中适配。已预留：Seedance 2.0 / Kling 3.0 / Runway Gen-3。

## Tech Stack

React + TypeScript + Vite + Tailwind CSS 4 + Motion + Lucide Icons

## License

MIT
