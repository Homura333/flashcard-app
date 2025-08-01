// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/flashcard-app/',  // ← ここを GitHub 上のリポジトリ名に変更（最後に `/` を忘れずに）
});
