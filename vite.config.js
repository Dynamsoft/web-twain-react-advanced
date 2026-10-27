import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '127.0.0.1',
        open: true,
		watch: {
            ignored: ['**/server/uploaded/**']
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    }
})
