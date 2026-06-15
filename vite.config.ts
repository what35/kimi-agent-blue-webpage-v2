import path from "path"
import fs from "node:fs"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

function generateVersionJson() {
  return {
    name: 'generate-version-json',
    writeBundle() {
      const version = process.env.CF_PAGES_COMMIT_SHA || new Date().toISOString()
      const outDir = 'dist'
      const file = path.join(outDir, 'version.json')
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(
        file,
        JSON.stringify({ version, builtAt: new Date().toISOString() }, null, 2)
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react(), generateVersionJson()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
