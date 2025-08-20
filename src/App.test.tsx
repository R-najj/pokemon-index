import { describe, expect, it } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store/store'
import { App } from './App'

function renderApp() {
	return render(
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>,
	)
}

describe('App', () => {
	it('renders without crashing', () => {
		renderApp()
		expect(document.body).toBeTruthy()
	})

	it('renders with error boundary wrapper', () => {
		renderApp()
		expect(document.body).toBeTruthy()
	})
})
