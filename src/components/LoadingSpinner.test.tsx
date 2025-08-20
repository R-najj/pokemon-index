import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from './LoadingSpinner'

describe('LoadingSpinner', () => {
	it('renders with default props', () => {
		render(<LoadingSpinner />)

		const spinners = screen.getAllByRole('generic')
		expect(spinners).toHaveLength(2)
		expect(spinners[1]).toHaveClass(
			'flex',
			'flex-col',
			'items-center',
			'justify-center',
		)
	})

	it('renders with custom size', () => {
		render(<LoadingSpinner size="lg" />)

		const spinners = screen.getAllByRole('generic')
		expect(spinners).toHaveLength(2)
	})

	it('renders with text', () => {
		const text = 'Loading data...'
		render(<LoadingSpinner text={text} />)

		expect(screen.getByText(text)).toBeInTheDocument()
		expect(screen.getByText(text)).toHaveAttribute('aria-live', 'polite')
	})

	it('renders with custom className', () => {
		const customClass = 'custom-spinner'
		render(<LoadingSpinner className={customClass} />)

		const spinners = screen.getAllByRole('generic')
		expect(spinners[1]).toHaveClass(
			'flex',
			'flex-col',
			'items-center',
			'justify-center',
			customClass,
		)
	})

	it('renders with all props', () => {
		const text = 'Processing...'
		const customClass = 'my-spinner'
		render(<LoadingSpinner size="sm" text={text} className={customClass} />)

		expect(screen.getByText(text)).toBeInTheDocument()
		const spinners = screen.getAllByRole('generic')
		expect(spinners[1]).toHaveClass(
			'flex',
			'flex-col',
			'items-center',
			'justify-center',
			customClass,
		)
	})

	it('renders without text when text is not provided', () => {
		render(<LoadingSpinner />)

		expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
	})
})
