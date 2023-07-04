/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 请求url前缀 */
  readonly VITE_BASE_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}