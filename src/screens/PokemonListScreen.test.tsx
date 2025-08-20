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
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'

import { BrowserRouter } from 'react-router-dom'
import { store } from '@/store/store'
import { pokemonApi } from '@/api/pokemonApi'
import { PokemonListScreen } from './PokemonListScreen'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer(
	http.get('https://pokeapi.co/api/v2/pokemon', ({ request }) => {
		const url = new URL(request.url)
		const offset = parseInt(url.searchParams.get('offset') || '0')
		const limit = parseInt(url.searchParams.get('limit') || '20')

		const pokemonNames = [
			'bulbasaur',
			'ivysaur',
			'venusaur',
			'charmander',
			'charmeleon',
			'charizard',
			'squirtle',
			'wartortle',
			'blastoise',
			'caterpie',
			'metapod',
			'butterfree',
			'weedle',
			'kakuna',
			'beedrill',
			'pidgey',
			'pidgeotto',
			'pidgeot',
			'rattata',
			'raticate',
			'spearow',
			'fearow',
			'ekans',
			'arbok',
		]

		const results = Array.from({ length: limit }, (_, i) => {
			const id = offset + i + 1
			const nameIndex = (offset + i) % pokemonNames.length
			return {
				name: pokemonNames[nameIndex],
				url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
				id,
			}
		})

		return HttpResponse.json({
			count: 100,
			next:
				offset + limit < 100
					? `https://pokeapi.co/api/v2/pokemon?offset=${offset + limit}&limit=${limit}`
					: null,
			previous:
				offset > 0
					? `https://pokeapi.co/api/v2/pokemon?offset=${Math.max(0, offset - limit)}&limit=${limit}`
					: null,
			results,
		})
	}),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderPokemonListScreen() {
	return render(
		<Provider store={store}>
			<BrowserRouter>
				<PokemonListScreen />
			</BrowserRouter>
		</Provider>,
	)
}

async function waitForContentToLoad() {
	await waitFor(() => {
		expect(
			screen.getByRole('heading', { name: /pokemon index/i }),
		).toBeInTheDocument()
		// wait for data to load
		expect(screen.getByText('bulbasaur')).toBeInTheDocument()
		// wait for pagination to appear
		expect(screen.getByText(/page 1 of 5/i)).toBeInTheDocument()
	})
}

describe('PokemonListScreen Integration', () => {
	beforeEach(() => {
		store.dispatch(pokemonApi.util.resetApiState())
		window.history.replaceState({}, '', '/')
	})

	it('renders pokemon index heading', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()
		expect(
			screen.getByRole('heading', { name: /pokemon index/i }),
		).toBeInTheDocument()
	})

	it('loads and displays pokemon list', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()

		expect(screen.getByText('bulbasaur')).toBeInTheDocument()
		expect(screen.getByText('ivysaur')).toBeInTheDocument()
		expect(screen.getByText('venusaur')).toBeInTheDocument()
	})

	it('filters pokemon by search term', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()

		const searchInput = screen.getByPlaceholderText(/search pokemon/i)
		fireEvent.change(searchInput, { target: { value: 'bulba' } })

		await waitFor(() => {
			expect(screen.getAllByText('bulbasaur')).toHaveLength(5)
			expect(
				screen.getByText(/found.*pokemon matching "bulba"/i),
			).toBeInTheDocument()
		})
	})

	it('clears search when search term is empty', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()

		const searchInput = screen.getByPlaceholderText(/search pokemon/i)
		fireEvent.change(searchInput, { target: { value: 'bulba' } })

		await waitFor(() => {
			expect(screen.queryByText('ivysaur')).not.toBeInTheDocument()
		})

		fireEvent.change(searchInput, { target: { value: '' } })

		await waitFor(() => {
			expect(screen.getByText('ivysaur')).toBeInTheDocument()
		})
	})

	it('shows clear search button when search term is entered', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()

		const searchInput = screen.getByPlaceholderText(/search pokemon/i)
		fireEvent.change(searchInput, { target: { value: 'test' } })

		await waitFor(() => {
			expect(
				screen.getByRole('button', { name: /clear search/i }),
			).toBeInTheDocument()
		})
	})

	it('clears search when clear button is clicked', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()

		const searchInput = screen.getByPlaceholderText(/search pokemon/i)
		fireEvent.change(searchInput, { target: { value: 'test' } })

		await waitFor(() => {
			expect(
				screen.getByRole('button', { name: /clear search/i }),
			).toBeInTheDocument()
		})

		fireEvent.click(screen.getByRole('button', { name: /clear search/i }))

		await waitFor(() => {
			expect(searchInput).toHaveValue('')
			expect(screen.getByText('bulbasaur')).toBeInTheDocument()
		})
	})

	it('navigates to pokemon detail when clicked', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()

		const pokemonLink = screen.getByRole('link', {
			name: /view details for bulbasaur/i,
		})
		expect(pokemonLink).toHaveAttribute('href', '/pokemon/1?fromPage=1')
	})

	it('shows pagination controls', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()

		expect(screen.getByText(/page 1 of 5/i)).toBeInTheDocument()
	})

	it('navigates to next page', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()

		const nextButton = screen.getByRole('button', { name: /go to next page/i })
		fireEvent.click(nextButton)

		await waitFor(() => {
			expect(screen.getByText('spearow')).toBeInTheDocument() // pokemon-21
			expect(screen.getByText(/page 2 of 5/i)).toBeInTheDocument()
		})
	})

	it('navigates to previous page', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()

		const nextButton = screen.getByRole('button', { name: /go to next page/i })
		fireEvent.click(nextButton)

		await waitFor(() => {
			expect(screen.getByText('spearow')).toBeInTheDocument()
		})

		const prevButton = screen.getByRole('button', {
			name: /go to previous page/i,
		})
		fireEvent.click(prevButton)

		await waitFor(() => {
			expect(screen.getByText('bulbasaur')).toBeInTheDocument()
			expect(screen.getByText(/page 1 of 5/i)).toBeInTheDocument()
		})
	})

	it('disables previous button on first page', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()

		const prevButton = screen.getByRole('button', {
			name: /go to previous page/i,
		})
		expect(prevButton).toBeDisabled()
	})

	it('disables next button on last page', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()

		for (let i = 0; i < 4; i++) {
			const nextButton = screen.getByRole('button', {
				name: /go to next page/i,
			})
			fireEvent.click(nextButton)
			await waitFor(() => {
				expect(screen.getByText(`Page ${i + 2} of 5`)).toBeInTheDocument()
			})
		}

		const nextButton = screen.getByRole('button', { name: /go to next page/i })
		expect(nextButton).toBeDisabled()
	})

	it('shows search results count', async () => {
		renderPokemonListScreen()
		await waitForContentToLoad()

		const searchInput = screen.getByPlaceholderText(/search pokemon/i)
		fireEvent.change(searchInput, { target: { value: 'bulba' } })

		await waitFor(() => {
			expect(
				screen.getByText(/found.*pokemon matching "bulba"/i),
			).toBeInTheDocument()
		})
	})
})
