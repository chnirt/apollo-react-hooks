import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { routes } from '../routes'
import PrivateRoute from '../utils/PrivateRoute'

function Root() {
	return (
		<BrowserRouter>
			<Switch>
				{routes.map((route, i) =>
					route.private === true ? (
						<PrivateRoute key={i} {...route} />
					) : (
						<Route key={i} {...route} />
					)
				)}
				<Redirect to="/login" />
			</Switch>
		</BrowserRouter>
	)
}

export default Root
