/**
 * API Configuration
 *
 * 在 Settings 页面或 .env 中配置你的 API Key。
 * 支持 OpenAI 兼容接口（Claude/GPT/Deepseek 等）。
 */

export interface APIConfig {
  // LLM — 用于生成分镜脚本
  llm: {
    baseUrl: string
    apiKey: string
    model: string
  }
  // Image — 用于生成分镜参考图
  image: {
    baseUrl: string
    apiKey: string
    model: string
  }
  // Video — 用于生成视频片段
  video: {
    baseUrl: string
    apiKey: string
    model: string
  }
}

const STORAGE_KEY = 'frameframe-api-config'

const DEFAULT_CONFIG: APIConfig = {
  llm: {
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o',
  },
  image: {
    baseUrl: 'https://api.chatfire.site/v1',
    apiKey: '',
    model: 'nonobanana2',
  },
  video: {
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    apiKey: '',
    model: 'doubao-seedance-2-0-260128',
  },
}

export function getConfig(): APIConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_CONFIG
  }
}

export function saveConfig(config: APIConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function isConfigured(section: keyof APIConfig): boolean {
  const config = getConfig()
  return !!config[section].apiKey && !!config[section].baseUrl
}
