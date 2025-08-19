import { LoadingSpinner } from './LoadingSpinner'

interface SuspenseFallbackProps {
	text?: string
	className?: string
}

export function SuspenseFallback({
	text = 'Loading...',
	className = 'h-64',
}: SuspenseFallbackProps) {
	return (
		<div className={`flex items-center justify-center ${className}`}>
			<LoadingSpinner size="lg" text={text} />
		</div>
	)
}
