import React, { useEffect } from 'react'
import './App.scss'
import Root from './pages/'
import { ApolloProvider } from 'react-apollo'
import client from './utils/apolloClient'
import Store from './store'

function App() {
	useEffect(() => {
		// KeepAwake
		var http = require('http')
		setInterval(function() {
			console.log('KeepAwake')
			// http.get('http://localhost:6789/')
			http.get('https://chnirt-apollo-client.herokuapp.com')
		}, 300000) // every 5 minutes (300000)
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
