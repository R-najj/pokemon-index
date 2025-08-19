import { Link } from 'react-router-dom'
import { useGetPokemonQuery } from '@/api/pokemonApi'
import {
	getTypeColor,
	getTypeBorderColor,
	getTypeBackgroundColor,
} from '@/utils/pokemonUtils'

type PokemonCardProps = {
	id: number
	name: string
}

export function PokemonCard({ id, name }: PokemonCardProps) {
	const { data: pokemon } = useGetPokemonQuery(id, {
		refetchOnMountOrArgChange: false,
		refetchOnFocus: false,
		refetchOnReconnect: false,
	})

	const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
	const primaryType =
		pokemon?.types?.[0]?.type?.name === 'normal' && pokemon?.types?.length > 1
			? pokemon.types[pokemon.types.length - 1]?.type?.name
			: pokemon?.types?.[0]?.type?.name

	const borderColor = primaryType
		? getTypeBorderColor(primaryType)
		: 'border-gray-300'
	const backgroundColor = primaryType
		? getTypeBackgroundColor(primaryType)
		: 'bg-gray-50'

	return (
		<Link
			to={`/pokemon/${id}`}
			className={`${backgroundColor} rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 w-full text-left block border-2 ${borderColor}`}
			aria-label={`View details for ${name}`}
		>
			<div className="text-center">
				<div
					className={`w-32 h-32 mx-auto mb-3 rounded-full flex items-center justify-center overflow-hidden`}
				>
					<img
						src={spriteUrl}
						alt={`${name} sprite`}
						className="w-28 h-28 object-contain"
						onError={(e) => {
							const target = e.target as HTMLImageElement
							target.style.display = 'none'
							target.nextElementSibling?.classList.remove('hidden')
						}}
					/>
					<div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center hidden">
						<span className="text-gray-400 text-sm">
							#{id.toString().padStart(4, '0')}
						</span>
					</div>
				</div>
				<div className="text-sm text-gray-500 mb-1">
					#{id.toString().padStart(4, '0')}
				</div>
				<h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
					{name}
				</h3>
				<div className="flex justify-center gap-2 flex-wrap">
					{pokemon?.types ? (
						pokemon.types.map((type) => (
							<span
								key={type.slot}
								className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${getTypeColor(type.type.name)}`}
							>
								{type.type.name}
							</span>
						))
					) : (
						<span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
							Loading...
						</span>
					)}
				</div>
			</div>
		</Link>
	)
}
