import React, { Component } from 'react'
import './App.scss'
import Root from './pages/'
import { ApolloProvider } from 'react-apollo'
import client from './utils/apolloClient'
class App extends Component {
	render() {
		return (
			<ApolloProvider client={client}>
				<Root />
			</ApolloProvider>
		)
	}
}

export default App
