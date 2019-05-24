import React from 'react'
import Auth from '../auth/Authenticate'
import { Route, Redirect } from 'react-router-dom'
import withLoadable from './loadable'

const PrivateRoute = route => (
	<Route
		render={props =>
			Auth.isAuthenticated ? (
				<Route
					{...route}
					component={props => {
						const MyComponent = withLoadable(
							import(`../pages/${route.component}`)
						)
						return <MyComponent {...props} routes={route.routes} />
					}}
				/>
			) : (
				<Redirect to="/login" />
			)
		}
	/>
)

export default PrivateRoute
