import { Routes, Route, Navigate } from 'react-router-dom'
import { PokemonListScreen } from '@/screens/PokemonListScreen'
import { PokemonDetailScreen } from '@/screens/PokemonDetailScreen'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export function App() {
	return (
		<ErrorBoundary>
			<Routes>
				<Route path="/" element={<PokemonListScreen />} />
				<Route path="/pokemon/:id" element={<PokemonDetailScreen />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</ErrorBoundary>
	)
}
