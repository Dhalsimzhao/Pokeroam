/// <reference types="vite/client" />

declare global {
  interface Window {
    api: Record<string, unknown>
  }
}

export {}
