import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { onError as OnError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { createUploadLink } from 'apollo-upload-client'
import store from '../mobx'

// const domain = 'devcloud4.digihcs.com'
const domain = 'localhost'
const port = process.env.REACT_APP_BE_PORT || 11068
const end_point = 'graphqllunch'

const urn = process.env.REACT_APP_GRAPHQL_URN || `${domain}:${port}/${end_point}`

const uploadLink = createUploadLink({ uri: `http://${urn}` })

const httpLink = new HttpLink({
	uri: `http://${urn}`
})

const wsLink = new WebSocketLink({
	uri: `ws://${urn}`,
	options: {
		// reconnect: true,
		// lazy: true,
		connectionParams: () => ({
			token: window.localStorage.getItem('access-token') || '',
			currentsite: window.localStorage.getItem('currentsite') || ''
		})
	}
})

const isFile = value =>
	(typeof File !== 'undefined' && value instanceof File) ||
	(typeof Blob !== 'undefined' && value instanceof Blob)

const isUpload = ({ variables }) => Object.values(variables).some(isFile)

const link = split(
	// split based on operation type
	({ query }) => {
		const definition = getMainDefinition(query)
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		)
	},
	wsLink,
	httpLink
)

const terminalLink = split(isUpload, uploadLink, link)

const errorLink = new OnError(({ graphQLErrors, networkError, operation }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path, extensions }) => {
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Code: ${extensions.code}`
			)
			if (extensions.code === '498' || extensions.code === '499') {
				store.authStore.logout()
				window.location.pathname = '/login'
			}
		})
	}
	if (networkError) {
		console.log(
			`[Network error ${operation.operationName}]: ${networkError.message}`
		)
	}
})

const authLink = setContext((_, { headers }) => {
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			token: window.localStorage.getItem('access-token') || '',
			currentsite: window.localStorage.getItem('currentsite') || ''
		}
	}
})

const defaultOptions = {
	// watchQuery: {
	// 	fetchPolicy: 'cache-and-network',
	// 	errorPolicy: 'ignore'
	// },
	// query: {
	// 	fetchPolicy: 'network-only',
	// 	errorPolicy: 'all'
	// },
	// mutate: {
	// 	errorPolicy: 'all'
	// }
}

const client = new ApolloClient({
	// cache: new InMemoryCache(),
	defaultOptions,
	cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
	link: ApolloLink.from([errorLink, authLink, terminalLink]),
	ssrForceFetchDelay: 100
})

export default client
