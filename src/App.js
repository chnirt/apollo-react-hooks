import React, { Component } from 'react'
import './App.scss'
import ScreenRoot from './pages/Root'
import { ApolloProvider } from 'react-apollo'
import client from './utils/apolloClient'
class App extends Component {
	render() {
		return (
			<ApolloProvider client={client}>
				<ScreenRoot />
			</ApolloProvider>
		)
	}
}

export default App
