import React from 'react'
import { Route } from 'react-router-dom'
import withLoadable from './loadable'

export default function RouteWithSubRoutes(route) {
	return (
		<Route
			{...route}
			component={props => {
				const MyComponent = withLoadable(import(`../pages/${route.component}`))
				return <MyComponent {...props} routes={route.routes} />
			}}
		/>
	)
}
