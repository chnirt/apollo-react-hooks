// This example uses React Router v4, although it should work
// equally well with other routers that support SSR
import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import Express from 'express'
import { StaticRouter } from 'react-router'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getDataFromTree } from 'react-apollo'
import { Provider } from 'mobx-react'
import store from '../tools/mobx'
import { I18nextProvider } from 'react-i18next'
import i18n from '../tools/i18n'

import Root from '../pages'

// Note you don't have to use any particular http server, but
// we're using Express in this example
const app = new Express()
app.use((req, res) => {
	const client = new ApolloClient({
		ssrMode: true,
		// Remember that this is the interface the SSR server will use to connect to the
		// API server, so we need to ensure it isn't firewalled, etc
		link: createHttpLink({
			uri: 'http://localhost:3010',
			credentials: 'same-origin',
			headers: {
				cookie: req.header('Cookie')
			}
		}),
		cache: new InMemoryCache()
	})

	const context = {}

	// The client-side App will instead use <BrowserRouter>
	const App = (
		<Provider store={store}>
			<ApolloProvider client={client}>
				<I18nextProvider i18n={i18n}>
					<StaticRouter location={req.url} context={context}>
						<Root />
					</StaticRouter>
				</I18nextProvider>
			</ApolloProvider>
		</Provider>
	)

	// rendering code (see below)
	function Html({ content, state }) {
		return (
			<html>
				<body>
					<div
						id="root"
						dangerouslySetInnerHTML={{
							__html: content
						}}
					/>
					<script
						dangerouslySetInnerHTML={{
							__html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(
								/</g,
								'\\u003c'
							)};`
						}}
					/>
				</body>
			</html>
		)
	}

	// during request (see above)
	getDataFromTree(App).then(() => {
		// We are ready to render for real
		const content = ReactDOM.renderToString(App)
		const initialState = client.extract()

		const html = <Html content={content} state={initialState} />

		res.status(200)
		res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`)
		res.end()
	})
})

const basePort = 3010

app.listen(basePort, () =>
	console.log(
		// eslint-disable-line no-console
		`app Server is now running on http://localhost:${basePort}`
	)
)
