export type PokemonListItem = {
	name: string
	url: string
	id?: number // Optional for original API response, required after transformation
}

export type PokemonListResponse = {
	count: number
	next: string | null
	previous: string | null
	results: PokemonListItem[]
}

export type PokemonType = {
	slot: number
	type: {
		name: string
		url: string
	}
}

export type PokemonStat = {
	base_stat: number
	effort: number
	stat: {
		name: string
		url: string
	}
}

export type PokemonDetail = {
	id: number
	name: string
	height: number
	weight: number
	base_experience: number
	types: PokemonType[]
	stats: PokemonStat[]
	sprites: {
		front_default: string | null
		back_default: string | null
		front_shiny: string | null
		back_shiny: string | null
	}
	abilities: Array<{
		ability: {
			name: string
			url: string
		}
		is_hidden: boolean
		slot: number
	}>
}
