import { describe, expect, it, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { store } from '@/store/store'
import { PokemonCard } from './PokemonCard'

const server = setupServer(
	http.get('https://pokeapi.co/api/v2/pokemon/:id', ({ params }) => {
		const id = parseInt(params.id as string)
		return HttpResponse.json({
			id,
			name: `pokemon-${id}`,
			sprites: {
				front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
			},
			types: [
				{
					type: {
						name: 'normal',
					},
				},
			],
		})
	}),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderPokemonCard(id: number, name: string) {
	return render(
		<Provider store={store}>
			<MemoryRouter>
				<PokemonCard id={id} name={name} />
			</MemoryRouter>
		</Provider>,
	)
}

describe('PokemonCard', () => {
	it('renders pokemon information correctly', async () => {
		renderPokemonCard(1, 'bulbasaur')

		expect(screen.getByText('bulbasaur')).toBeInTheDocument()
		expect(screen.getAllByText('#0001')).toHaveLength(2)

		await waitFor(() => {
			expect(screen.getByText('normal')).toBeInTheDocument()
		})
	})

	it('renders pokemon sprite image', () => {
		renderPokemonCard(25, 'pikachu')

		const image = screen.getByAltText('pikachu sprite')
		expect(image).toBeInTheDocument()
		expect(image).toHaveAttribute(
			'src',
			'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
		)
	})

	it('renders as a link to pokemon detail page', () => {
		renderPokemonCard(1, 'bulbasaur')

		const link = screen.getByRole('link', {
			name: /view details for bulbasaur/i,
		})
		expect(link).toHaveAttribute('href', '/pokemon/1')
	})

	it('has correct accessibility attributes', () => {
		renderPokemonCard(1, 'bulbasaur')

		expect(screen.getByRole('link')).toHaveAttribute(
			'aria-label',
			'View details for bulbasaur',
		)
		expect(screen.getByAltText('bulbasaur sprite')).toBeInTheDocument()
	})

	it('handles different pokemon IDs correctly', () => {
		renderPokemonCard(999, 'unknown')

		expect(screen.getAllByText('#0999')).toHaveLength(2)
		expect(screen.getByAltText('unknown sprite')).toHaveAttribute(
			'src',
			'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/999.png',
		)
	})

	it('displays pokemon name as provided', () => {
		renderPokemonCard(1, 'BULBASAUR')

		expect(screen.getByText('BULBASAUR')).toBeInTheDocument()
	})
})
