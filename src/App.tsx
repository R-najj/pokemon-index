import { Routes, Route } from 'react-router-dom'
import { PokemonListScreen } from '@/screens/PokemonListScreen'
import { PokemonDetailScreen } from '@/screens/PokemonDetailScreen'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export function App() {
	return (
		<ErrorBoundary>
			<Routes>
				<Route path="/" element={<PokemonListScreen />} />
				<Route path="/pokemon/:id" element={<PokemonDetailScreen />} />
			</Routes>
		</ErrorBoundary>
	)
}
