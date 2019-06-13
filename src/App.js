import React, { useEffect } from 'react'
import './App.scss'
import Root from './pages/'
import { ApolloProvider } from 'react-apollo'
import { I18nextProvider } from 'react-i18next'
import client from './tools/apollo'
import i18n from './tools/i18n'
import { Provider } from 'mobx-react'
import store from './tools/mobx'

function App() {
	// useEffect(() => {
	// 	// KeepAwake
	// 	let wakeUp = setInterval(() => {
	// 		// fetch('http://localhost:3000')
	// 		fetch('https://chnirt-apollo-client.herokuapp.com/')
	// 			.then(res => {
	// 				console.log(res)
	// 			})
	// 			.catch(err => {
	// 				console.log(err)
	// 			})
	// 	}, 300000) // every 5 minutes (300000)
	// 	return () => clearInterval(wakeUp)
	// })
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
