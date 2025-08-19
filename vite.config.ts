import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwind from '@tailwindcss/vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwind()],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['src/setupTests.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			thresholds: {
				lines: 60,
				functions: 60,
				branches: 60,
				statements: 60,
			},
		},
	},
})
