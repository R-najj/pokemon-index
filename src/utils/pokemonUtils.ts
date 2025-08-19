export const getTypeColor = (typeName: string) => {
	const colors: Record<string, string> = {
		normal: 'bg-gray-100 text-gray-800',
		fire: 'bg-red-100 text-red-800',
		water: 'bg-blue-100 text-blue-800',
		electric: 'bg-yellow-100 text-yellow-800',
		grass: 'bg-green-100 text-green-800',
		ice: 'bg-cyan-100 text-cyan-800',
		fighting: 'bg-red-200 text-red-900',
		poison: 'bg-purple-100 text-purple-800',
		ground: 'bg-yellow-200 text-yellow-900',
		flying: 'bg-indigo-100 text-indigo-800',
		psychic: 'bg-pink-100 text-pink-800',
		bug: 'bg-lime-100 text-lime-800',
		rock: 'bg-yellow-300 text-yellow-900',
		ghost: 'bg-purple-200 text-purple-900',
		dragon: 'bg-indigo-200 text-indigo-900',
		dark: 'bg-gray-800 text-white',
		steel: 'bg-gray-300 text-gray-800',
		fairy: 'bg-pink-200 text-pink-900',
	}
	return colors[typeName] || 'bg-gray-100 text-gray-800'
}

export const getTypeBorderColor = (typeName: string) => {
	const borderColors: Record<string, string> = {
		normal: 'border-gray-300',
		fire: 'border-red-400',
		water: 'border-blue-400',
		electric: 'border-yellow-400',
		grass: 'border-green-400',
		ice: 'border-cyan-400',
		fighting: 'border-red-500',
		poison: 'border-purple-400',
		ground: 'border-yellow-500',
		flying: 'border-indigo-400',
		psychic: 'border-pink-400',
		bug: 'border-lime-400',
		rock: 'border-yellow-600',
		ghost: 'border-purple-500',
		dragon: 'border-indigo-500',
		dark: 'border-gray-700',
		steel: 'border-gray-400',
		fairy: 'border-pink-500',
	}
	return borderColors[typeName] || 'border-gray-300'
}

export const getTypeBackgroundColor = (
	typeName: string,
	weight: string | null = null,
) => {
	const backgroundColors: Record<string, string> = {
		normal: `bg-gray-${weight || '50'}`,
		fire: `bg-red-${weight || '50'}`,
		water: `bg-blue-${weight || '50'}`,
		electric: `bg-yellow-${weight || '50'}`,
		grass: `bg-green-${weight || '50'}`,
		ice: `bg-cyan-${weight || '50'}`,
		fighting: `bg-red-${weight || '100'}`,
		poison: `bg-purple-${weight || '50'}`,
		ground: `bg-yellow-${weight || '100'}`,
		flying: `bg-indigo-${weight || '50'}`,
		psychic: `bg-pink-${weight || '50'}`,
		bug: `bg-lime-${weight || '50'}`,
		rock: `bg-yellow-${weight || '200'}`,
		ghost: `bg-purple-${weight || '100'}`,
		dragon: `bg-indigo-${weight || '100'}`,
		dark: `bg-gray-${weight || '100'}`,
		steel: `bg-gray-${weight || '100'}`,
		fairy: `bg-pink-${weight || '100'}`,
	}
	return backgroundColors[typeName] || `bg-gray-${weight || '50'}`
}
