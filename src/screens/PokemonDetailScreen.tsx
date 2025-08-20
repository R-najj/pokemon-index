import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'
import { useGetPokemonQuery } from '@/api/pokemonApi'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import {
	getTypeColor,
	getTypeBorderColor,
	getTypeBackgroundColor,
} from '@/utils/pokemonUtils'

function PokemonDetailContent() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const pokemonId = parseInt(id || '0')

	const {
		data: pokemon,
		error,
		isLoading,
	} = useGetPokemonQuery(pokemonId, {
		skip: !pokemonId || isNaN(pokemonId),
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		refetchOnReconnect: true,
	})

	const handleBackToList = useCallback(() => {
		const fromPage = searchParams.get('fromPage')
		if (fromPage) {
			navigate(`/?page=${fromPage}`)
		} else {
			navigate('/')
		}
	}, [navigate, searchParams])

	const handlePrevious = useCallback(() => {
		if (pokemonId > 1) {
			const fromPage = searchParams.get('fromPage')
			const url = fromPage
				? `/pokemon/${pokemonId - 1}?fromPage=${fromPage}`
				: `/pokemon/${pokemonId - 1}`
			navigate(url)
		}
	}, [navigate, pokemonId, searchParams])

	const handleNext = useCallback(() => {
		const fromPage = searchParams.get('fromPage')
		const url = fromPage
			? `/pokemon/${pokemonId + 1}?fromPage=${fromPage}`
			: `/pokemon/${pokemonId + 1}`
		navigate(url)
	}, [navigate, pokemonId, searchParams])

	if (error) {
		if ('status' in error && error.status === 404) {
			return (
				<div className="text-center py-12">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						Pokemon not found
					</h1>
					<p className="text-gray-600 mb-6">
						The Pokemon you're looking for doesn't exist or the ID is invalid.
					</p>
					<button
						onClick={handleBackToList}
						className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						aria-label="Back to Pokemon list"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to List
					</button>
				</div>
			)
		}
		throw error
	}

	if (isLoading || !pokemon) {
		return (
			<LoadingSpinner
				text="Loading Pokemon details..."
				className="min-h-[60vh] w-full"
			/>
		)
	}

	const primaryType =
		pokemon?.types?.[0]?.type?.name === 'normal' && pokemon?.types?.length > 1
			? pokemon.types[pokemon.types.length - 1]?.type?.name
			: pokemon?.types?.[0]?.type?.name
	const borderColor = primaryType
		? getTypeBorderColor(primaryType)
		: 'border-gray-300'
	const backgroundColor = primaryType
		? getTypeBackgroundColor(primaryType, '500')
		: 'bg-gray-50'

	return (
		<div className="space-y-6">
			<header className="flex items-center gap-4">
				<button
					onClick={handleBackToList}
					className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-gray-500 focus:outline-none rounded"
					aria-label="Back to Pokemon list"
				>
					<ArrowLeft className="w-5 h-5" />
					Back to List
				</button>
			</header>

			<div className={` rounded-lg shadow-lg p-8 border-2 ${borderColor}`}>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="text-center">
						<div
							className={`w-64 h-64 mx-auto mb-4 rounded-full border-4 ${borderColor} flex items-center justify-center overflow-hidden`}
						>
							{pokemon.sprites.front_default ? (
								<img
									src={pokemon.sprites.front_default}
									alt={`${pokemon.name} sprite`}
									className="w-56 h-56 object-contain"
								/>
							) : (
								<div className="w-56 h-56 bg-gray-100 rounded-full flex items-center justify-center">
									<span className="text-gray-400">No image available</span>
								</div>
							)}
						</div>

						<div className="mt-4">
							<h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
								{pokemon.name}
							</h1>
							<p className="text-lg text-gray-600 mb-3">
								#{pokemon.id.toString().padStart(4, '0')}
							</p>
							<div className="flex gap-2 justify-center">
								{pokemon.types.map((type) => (
									<span
										key={type.slot}
										className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTypeColor(type.type.name)}`}
									>
										{type.type.name}
									</span>
								))}
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">
								Base Info
							</h2>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-gray-500">Height</p>
									<p className="font-medium">
										{(pokemon.height / 10).toFixed(1)}m
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Weight</p>
									<p className="font-medium">
										{(pokemon.weight / 10).toFixed(1)}kg
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Base Experience</p>
									<p className="font-medium">{pokemon.base_experience}</p>
								</div>
							</div>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">
								Base Stats
							</h2>
							<div className="space-y-2">
								{pokemon.stats.map((stat) => (
									<div key={stat.stat.name} className="flex items-center gap-4">
										<span className="text-sm text-gray-500 capitalize w-30">
											{stat.stat.name}
										</span>
										<div className="flex-1 bg-gray-200 rounded-full h-2">
											<div
												className={`${backgroundColor} h-2 rounded-full`}
												style={{ width: `${(stat.base_stat / 255) * 100}%` }}
											></div>
										</div>
										<span className="w-12 text-sm font-medium text-gray-900">
											{stat.base_stat}
										</span>
									</div>
								))}
							</div>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">
								Abilities
							</h2>
							<div className="space-y-2">
								{pokemon.abilities.map((ability) => (
									<div
										key={ability.ability.name}
										className="flex items-center gap-2"
									>
										<span className="capitalize">{ability.ability.name}</span>
										{ability.is_hidden && (
											<span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
												Hidden
											</span>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
					<button
						onClick={handlePrevious}
						disabled={pokemonId <= 1}
						className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
						aria-label="View previous pokemon"
					>
						<ChevronLeft className="w-4 h-4" />
						Previous
					</button>

					<button
						onClick={handleNext}
						className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
						aria-label="View next pokemon"
					>
						Next
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	)
}

export function PokemonDetailScreen() {
	return (
		<div className="min-h-screen p-6">
			<PokemonDetailContent />
		</div>
	)
}
