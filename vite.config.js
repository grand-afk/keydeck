import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ──────────────────────────────────────────────────────────────────────────────
// Set BASE to your GitHub Pages path so assets resolve correctly.
//
// Your repo is:  https://github.com/grand-afk/keyboard-shortcuts-trainer
// GitHub Pages:  https://grand-afk.github.io/keyboard-shortcuts-trainer/
//
// Keep base as '/' if you later use a custom domain (e.g. keydeck.io).
// ──────────────────────────────────────────────────────────────────────────────
export default defineConfig({
  plugins: [react()],
  base: '/keydeck/',
})
