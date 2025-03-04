/// <reference types="vite/client" />

// Declare Vue files as modules
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Additional environment variables (if any)
interface ImportMeta {
  readonly env: {
    readonly VITE_APP_TITLE: string
    // Add any other environment variables used in your app
  }
}
