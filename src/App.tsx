import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export function App() {
	return (
		<ErrorBoundary>
			<Routes>
			</Routes>
		</ErrorBoundary>
	)
}
