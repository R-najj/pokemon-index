import { describe, expect, it } from 'vitest'
import { pokemonApi } from './pokemonApi'

describe('pokemonApi', () => {
	it('should have correct base configuration', () => {
		expect(pokemonApi.reducerPath).toBe('pokemonApi')
		expect(pokemonApi.endpoints).toBeDefined()
	})

	it('should have getPokemonList endpoint', () => {
		const endpoint = pokemonApi.endpoints.getPokemonList
		expect(endpoint).toBeDefined()
	})

	it('should have getPokemon endpoint', () => {
		const endpoint = pokemonApi.endpoints.getPokemon
		expect(endpoint).toBeDefined()
	})

	it('should have searchPokemon endpoint', () => {
		const endpoint = pokemonApi.endpoints.searchPokemon
		expect(endpoint).toBeDefined()
	})

	it('should have middleware', () => {
		expect(pokemonApi.middleware).toBeDefined()
	})

	it('should have reducer', () => {
		expect(pokemonApi.reducer).toBeDefined()
	})
})
