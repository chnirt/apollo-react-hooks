import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { routes } from '../routes'
import PrivateRoute from '../utils/privateRoute'
import withLoadable from '../utils/loadable'

function Root() {
	return (
		<BrowserRouter>
			<Switch>
				{routes.map((route, i) =>
					route.private === true ? (
						<PrivateRoute key={i} {...route} />
					) : (
						<Route
							key={i}
							{...route}
							component={props => {
								const MyComponent = withLoadable(import(`./${route.component}`))
								return <MyComponent {...props} routes={route.routes} />
							}}
						/>
					)
				)}
				<Redirect to="/login" />
			</Switch>
		</BrowserRouter>
	)
}

export default Root
