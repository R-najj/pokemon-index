import '@testing-library/jest-dom/vitest'
import {
	describe,
	expect,
	it,
	beforeEach,
	beforeAll,
	afterEach,
	afterAll,
} from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'

import { store } from '@/store/store'
import { PokemonDetailScreen } from './PokemonDetailScreen'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const server = setupServer(
	http.get('https://pokeapi.co/api/v2/pokemon/:id', ({ params }) => {
		const { id } = params
		const pokemonId = parseInt(id as string)

		if (pokemonId <= 0 || pokemonId > 1000) {
			return new HttpResponse(null, { status: 404 })
		}

		return HttpResponse.json({
			id: pokemonId,
			name: 'bulbasaur',
			height: 7,
			weight: 69,
			base_experience: 64,
			types: [
				{
					slot: 1,
					type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' },
				},
				{
					slot: 2,
					type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' },
				},
			],
			stats: [
				{
					base_stat: 45,
					effort: 0,
					stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' },
				},
				{
					base_stat: 49,
					effort: 0,
					stat: { name: 'attack', url: 'https://pokeapi.co/api/v2/stat/2/' },
				},
			],
			sprites: { front_default: null },
			abilities: [
				{
					ability: {
						name: 'overgrow',
						url: 'https://pokeapi.co/api/v2/ability/65/',
					},
					is_hidden: false,
					slot: 1,
				},
			],
		})
	}),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderPokemonDetailScreen(path = '/pokemon/1') {
	return render(
		<Provider store={store}>
			<MemoryRouter initialEntries={[path]}>
				<Routes>
					<Route path="/pokemon/:id" element={<PokemonDetailScreen />} />
				</Routes>
			</MemoryRouter>
		</Provider>,
	)
}

async function waitForContentToLoad() {
	await waitFor(() => {
		expect(
			screen.getByRole('button', { name: /back to pokemon list/i }),
		).toBeInTheDocument()
	})
}

describe('PokemonDetailScreen Integration', () => {
	beforeEach(() => {
		store.dispatch({ type: 'RESET' })
	})

	it('shows back to list button', async () => {
		renderPokemonDetailScreen()
		await waitForContentToLoad()
		expect(
			screen.getByRole('button', { name: /back to pokemon list/i }),
		).toBeInTheDocument()
	})

	it('shows 404 state for non-existent pokemon', async () => {
		renderPokemonDetailScreen('/pokemon/9999')

		await waitFor(() => {
			expect(screen.getByText('Pokemon not found')).toBeInTheDocument()
		})

		expect(
			screen.getByText(/the pokemon you're looking for doesn't exist/i),
		).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: /back to pokemon list/i }),
		).toBeInTheDocument()
	})
})
