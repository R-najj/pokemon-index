import { describe, expect, it } from 'vitest'
import {
	getTypeColor,
	getTypeBorderColor,
	getTypeBackgroundColor,
} from './pokemonUtils'

describe('pokemonUtils', () => {
	describe('getTypeColor', () => {
		it('returns correct colors for known types', () => {
			expect(getTypeColor('fire')).toBe('bg-red-100 text-red-800')
			expect(getTypeColor('water')).toBe('bg-blue-100 text-blue-800')
			expect(getTypeColor('grass')).toBe('bg-green-100 text-green-800')
			expect(getTypeColor('electric')).toBe('bg-yellow-100 text-yellow-800')
			expect(getTypeColor('psychic')).toBe('bg-pink-100 text-pink-800')
		})

		it('returns default color for unknown types', () => {
			expect(getTypeColor('unknown')).toBe('bg-gray-100 text-gray-800')
			expect(getTypeColor('')).toBe('bg-gray-100 text-gray-800')
		})

		it('is case sensitive for type names', () => {
			expect(getTypeColor('FIRE')).toBe('bg-gray-100 text-gray-800')
			expect(getTypeColor('Fire')).toBe('bg-gray-100 text-gray-800')
			expect(getTypeColor('fire')).toBe('bg-red-100 text-red-800')
		})
	})

	describe('getTypeBorderColor', () => {
		it('returns correct border colors for known types', () => {
			expect(getTypeBorderColor('fire')).toBe('border-red-400')
			expect(getTypeBorderColor('water')).toBe('border-blue-400')
			expect(getTypeBorderColor('grass')).toBe('border-green-400')
			expect(getTypeBorderColor('electric')).toBe('border-yellow-400')
			expect(getTypeBorderColor('psychic')).toBe('border-pink-400')
		})

		it('returns default border color for unknown types', () => {
			expect(getTypeBorderColor('unknown')).toBe('border-gray-300')
			expect(getTypeBorderColor('')).toBe('border-gray-300')
		})
	})

	describe('getTypeBackgroundColor', () => {
		it('returns correct background colors for known types', () => {
			expect(getTypeBackgroundColor('fire')).toBe('bg-red-50')
			expect(getTypeBackgroundColor('water')).toBe('bg-blue-50')
			expect(getTypeBackgroundColor('grass')).toBe('bg-green-50')
			expect(getTypeBackgroundColor('electric')).toBe('bg-yellow-50')
			expect(getTypeBackgroundColor('psychic')).toBe('bg-pink-50')
		})

		it('returns default background color for unknown types', () => {
			expect(getTypeBackgroundColor('unknown')).toBe('bg-gray-50')
			expect(getTypeBackgroundColor('')).toBe('bg-gray-50')
		})
	})
})
