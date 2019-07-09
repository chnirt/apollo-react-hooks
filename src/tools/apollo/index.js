import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import AuthStore from '../mobx/auth'

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' })
// const httpLink = new HttpLink({
// 	uri: 'https://chnirt-apollo-server.herokuapp.com/graphql'
// })

const errorLink = new onError(({ graphQLErrors, networkError, operation }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) =>
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			)
		)
	}
	if (networkError) {
		const authStore = new AuthStore()
		if (networkError.statusCode === 400) {
			authStore.logout()
			window.location.pathname = '/login'
		}
		console.log(
			`[Network error ${operation.operationName}]: ${networkError.message}`
		)
	}
})

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = window.localStorage.getItem('access-token')
	const currentsite = window.localStorage.getItem('currentsite')
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			token: token ? token : '',
			currentsite: currentsite ? currentsite : ''
		}
	}
})

const client = new ApolloClient({
	// cache: new InMemoryCache(),
	cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
	link: ApolloLink.from([errorLink, authLink, httpLink]),
	ssrForceFetchDelay: 100
})

export default client
