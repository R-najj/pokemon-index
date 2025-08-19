import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetPokemonListQuery, useSearchPokemonQuery } from '@/api/pokemonApi'
import { PokemonCard } from '@/components/PokemonCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'

const ITEMS_PER_PAGE = 20

function PokemonListContent() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [searchTerm, setSearchTerm] = useState('')
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
	const searchInputRef = useRef<HTMLInputElement>(null)

	const currentPage = useMemo(() => {
		const pageParam = searchParams.get('page')
		const page = pageParam ? parseInt(pageParam, 10) - 1 : 0
		return Math.max(0, page) // ensure non-negative
	}, [searchParams])

	const shouldSearch = useMemo(
		() => debouncedSearchTerm.trim().length > 0,
		[debouncedSearchTerm],
	)

	const listQuery = useGetPokemonListQuery(
		{ limit: ITEMS_PER_PAGE, offset: currentPage * ITEMS_PER_PAGE },
		{
			skip: shouldSearch,
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		},
	)

	const searchQuery = useSearchPokemonQuery(
		{ query: debouncedSearchTerm, limit: 100 },
		{
			skip: !shouldSearch,
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		},
	)

	// debounce search
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm)
		}, 300)

		return () => clearTimeout(timer)
	}, [searchTerm])

	const activeQuery = shouldSearch ? searchQuery : listQuery
	const { data, error, isLoading } = activeQuery

	const handlePageChange = useCallback(
		(newPage: number) => {
			const newSearchParams = new URLSearchParams(searchParams)
			if (newPage === 0) {
				newSearchParams.delete('page')
			} else {
				newSearchParams.set('page', (newPage + 1).toString())
			}
			setSearchParams(newSearchParams)
		},
		[searchParams, setSearchParams],
	)

	const totalPages = useMemo(
		() => (data ? Math.ceil(data.count / ITEMS_PER_PAGE) : 0),
		[data],
	)

	useEffect(() => {
		if (totalPages > 0 && currentPage >= totalPages) {
			handlePageChange(Math.max(0, totalPages - 1))
		}
	}, [totalPages, currentPage, handlePageChange])

	// maintain focus on search input
	useEffect(() => {
		if (
			searchInputRef.current &&
			document.activeElement !== searchInputRef.current
		) {
			searchInputRef.current.focus()
		}
	}, [data])

	// throw error for Error Boundary to catch
	if (error) {
		throw error
	}

	const hasAnyData = listQuery.data || searchQuery.data
	if (isLoading && !hasAnyData) {
		return (
			<LoadingSpinner
				text="Loading Pokemon list..."
				className="min-h-[60vh] w-full"
			/>
		)
	}

	// if activeQuery has no data but we have data from the other query, show empty results
	if (!data && hasAnyData) {
		return (
			<div className="space-y-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						ref={searchInputRef}
						type="text"
						placeholder="Search Pokemon..."
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value)
							if (e.target.value.trim().length === 0) {
								handlePageChange(0)
							}
						}}
						className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
						aria-label="Search Pokemon by name"
					/>
					{searchTerm && (
						<button
							onClick={() => {
								setSearchTerm('')
								handlePageChange(0)
							}}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
							aria-label="Clear search"
						>
							<X className="w-5 h-5" />
						</button>
					)}
				</div>
				<div className="text-center text-gray-600 py-12">
					{shouldSearch
						? 'No Pokemon found matching your search.'
						: 'No Pokemon available.'}
				</div>
			</div>
		)
	}

	if (!data) {
		return null
	}

	return (
		<div className="space-y-6">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
				<input
					ref={searchInputRef}
					type="text"
					placeholder="Search Pokemon..."
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value)
						if (e.target.value.trim().length === 0) {
							handlePageChange(0)
						}
					}}
					className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
					aria-label="Search Pokemon by name"
				/>
				{searchTerm && (
					<button
						onClick={() => {
							setSearchTerm('')
							handlePageChange(0)
						}}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
						aria-label="Clear search"
					>
						<X className="w-5 h-5" />
					</button>
				)}
			</div>

			<section aria-label="Pokemon list">
				<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					{data.results.map((pokemon) => (
						<li key={pokemon.id}>
							<PokemonCard id={pokemon.id!} name={pokemon.name} />
						</li>
					))}
				</ul>
			</section>

			{!shouldSearch && totalPages > 1 && (
				<nav aria-label="Pokemon list pagination">
					<div className="flex justify-center items-center gap-4 mt-8">
						<button
							onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
							disabled={currentPage === 0}
							className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
							aria-label="Go to previous page"
						>
							<ChevronLeft className="w-4 h-4" />
							Previous
						</button>

						<span className="text-gray-600" aria-current="page">
							Page {currentPage + 1} of {totalPages}
						</span>

						<button
							onClick={() =>
								handlePageChange(Math.min(totalPages - 1, currentPage + 1))
							}
							disabled={currentPage === totalPages - 1}
							className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
							aria-label="Go to next page"
						>
							Next
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				</nav>
			)}

			{shouldSearch && data && (
				<div className="text-center text-gray-600">
					Found {data.results.length} Pokemon matching "{debouncedSearchTerm}"
				</div>
			)}
		</div>
	)
}

export function PokemonListScreen() {
	return (
		<div className="min-h-screen p-6">
			<PokemonListContent />
		</div>
	)
}
