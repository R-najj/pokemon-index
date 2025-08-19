import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '@/store/store'
import { App } from '@/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<div className="min-h-screen bg-gray-50">
					<div className="container mx-auto px-4 py-8">
						<App />
					</div>
				</div>
			</BrowserRouter>
		</Provider>
	</StrictMode>,
)
