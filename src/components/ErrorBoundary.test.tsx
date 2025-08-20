import { describe, expect, it, vi, afterEach, afterAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
	if (shouldThrow) {
		throw new Error('Test error')
	}
	return <div>No error</div>
}

describe('ErrorBoundary', () => {
	afterEach(() => {
		consoleSpy.mockClear()
	})

	afterAll(() => {
		consoleSpy.mockRestore()
	})

	it('renders children when no error occurs', () => {
		render(
			<ErrorBoundary>
				<div>Test content</div>
			</ErrorBoundary>,
		)

		expect(screen.getByText('Test content')).toBeInTheDocument()
	})

	it('renders error UI when error occurs', () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		)

		expect(screen.getByText('Something went wrong')).toBeInTheDocument()
		expect(
			screen.getByText('Please refresh the page and try again.'),
		).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: /refresh page/i }),
		).toBeInTheDocument()
	})

	it('renders custom fallback when provided', () => {
		const customFallback = <div>Custom error message</div>

		render(
			<ErrorBoundary fallback={customFallback}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		)

		expect(screen.getByText('Custom error message')).toBeInTheDocument()
		expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
	})

	it('has refresh button that can be clicked', () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		)

		const refreshButton = screen.getByRole('button', { name: /refresh page/i })
		expect(refreshButton).toBeInTheDocument()

		expect(() => fireEvent.click(refreshButton)).not.toThrow()
	})

	it('logs error when error occurs', () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		)

		expect(consoleSpy).toHaveBeenCalledWith(
			'Error caught by boundary:',
			expect.any(Error),
			expect.any(Object),
		)
	})
})
