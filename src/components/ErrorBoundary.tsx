import { Component, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface Props {
	children: ReactNode
	fallback?: ReactNode
}

interface State {
	hasError: boolean
	error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
		console.error('Error caught by boundary:', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback
			}

			return (
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<div className="text-center">
						<div className="text-red-600 mb-4">
							<Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
							<p className="text-lg font-medium">Something went wrong</p>
							<p className="text-sm text-gray-600 mt-2">
								Please refresh the page and try again.
							</p>
						</div>
						<button
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Refresh Page
						</button>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}
