import React, { useEffect } from 'react'
import './App.scss'
import Root from './pages/'
import { ApolloProvider } from 'react-apollo'
import client from './utils/apolloClient'
import Store from './store'

function App() {
	useEffect(() => {
		// KeepAwake
		const wakeUp = setInterval(() => {
			console.log('KeepAwake')
			fetch('https://chnirt-apollo-client.herokuapp.com/')
				.then(res => {
					console.log(res)
				})
				.catch(err => {
					console.log(err)
				})
		}, 300000) // every 5 minutes (300000)
		return () => {
			clearInterval(wakeUp)
		}
	})
	return (
		<ApolloProvider client={client}>
			<Store>
				<Root />
			</Store>
		</ApolloProvider>
	)
}

export default App
