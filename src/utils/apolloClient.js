import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'

const cache = new InMemoryCache()
// const httpLink = new HttpLink({ uri: 'http://localhost:7000/graphql' })
const httpLink = new HttpLink({
	uri: 'https://chnirthgraphql.herokuapp.com/graphql'
})

const errorLink = new onError(({ graphQLErrors, networkError, operation }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, path }) =>
			console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`)
		)
	}
	if (networkError) {
		console.log(
			`[Network error ${operation.operationName}]: ${networkError.message}`
		)
	}
})

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('access-token')
	const context = token
		? {
				headers: {
					...headers,
					authorization: `Bearer ${token}`
				}
		  }
		: null
	return context
})

const client = new ApolloClient({
	cache,
	link: ApolloLink.from([errorLink, authLink, httpLink])
})

export default client
