import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'mobx-react'
import './App.scss'
import Root from './pages'
import client from './tools/apollo'
import i18n from './tools/i18n'
import store from './tools/mobx'

function App() {
	return (
		<Provider store={store}>
			<ApolloProvider client={client}>
				<I18nextProvider i18n={i18n}>
					<Root />
				</I18nextProvider>
			</ApolloProvider>
		</Provider>
	)
}

export default App
