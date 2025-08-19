import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { PokemonListResponse, PokemonDetail } from '@/types/pokemon'

export const pokemonApi = createApi({
	reducerPath: 'pokemonApi',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_BASE_URL,
	}),
	tagTypes: ['Pokemon', 'PokemonList'],
	endpoints: (builder) => ({
		getPokemonList: builder.query<
			PokemonListResponse & {
				results: Array<PokemonListResponse['results'][0] & { id: number }>
			},
			{ limit: number; offset: number }
		>({
			query: ({ limit, offset }) => `/pokemon?limit=${limit}&offset=${offset}`,
			transformResponse: (response: PokemonListResponse) => ({
				...response,
				results: response.results.map((item) => ({
					...item,
					id: parseInt(item.url.split('/').slice(-2)[0]),
				})),
			}),
			providesTags: (result, _error, { offset }) =>
				result
					? [
							...result.results.map(({ id }) => ({
								type: 'Pokemon' as const,
								id,
							})),
							{ type: 'PokemonList', id: `list-${offset}` },
						]
					: [{ type: 'PokemonList', id: `list-${offset}` }],
			keepUnusedDataFor: 300,
		}),
		getPokemon: builder.query<PokemonDetail, string | number>({
			query: (idOrName) => `/pokemon/${idOrName}`,
			providesTags: (_result, _error, id) => [{ type: 'Pokemon', id }],
			keepUnusedDataFor: 600,
		}),
		searchPokemon: builder.query<
			PokemonListResponse & {
				results: Array<PokemonListResponse['results'][0] & { id: number }>
			},
			{ query: string; limit?: number }
		>({
			query: ({ limit = 20 }) => `/pokemon?limit=${limit}&offset=0`,
			transformResponse: (response: PokemonListResponse, _meta, { query }) => ({
				...response,
				results: response.results
					.filter((item) =>
						item.name.toLowerCase().includes(query.toLowerCase()),
					)
					.map((item) => ({
						...item,
						id: parseInt(item.url.split('/').slice(-2)[0]),
					})),
			}),
			providesTags: (result, _error, { query }) =>
				result
					? [
							...result.results.map(({ id }) => ({
								type: 'Pokemon' as const,
								id,
							})),
							{ type: 'PokemonList', id: `search-${query}` },
						]
					: [{ type: 'PokemonList', id: `search-${query}` }],
		}),
	}),
})

export const {
	useGetPokemonListQuery,
	useGetPokemonQuery,
	useSearchPokemonQuery,
} = pokemonApi
