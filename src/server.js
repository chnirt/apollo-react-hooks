import React from 'react'
import Express from 'express'
import ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'
import configureStore from './redux/configureStore'
import App from './App'
import { StaticRouter } from 'react-router'

const app = new Express()

app.use((req, res) => {
	const initialStore = {
		isFetching: false,
		apps: {}
	}
	// configure store
	const store = configureStore(initialStore)
	const preloadedState = store.getState()

	const appTree = (
		<Provider store={store}>
			<App />
		</Provider>
	)

	const content = ReactDOMServer.renderToString(appTree)

	res.write(`
   <!doctype html>
   <html>
     <body>
       <div id="app">${content}</div>
       <script>
         window.__data=${JSON.stringify(preloadedState)};
       </script>
     </body>
   </html>
   `)
	res.end()
})
