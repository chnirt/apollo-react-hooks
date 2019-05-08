import React from 'react'
import { Route } from 'react-router-dom'

const RouteWithSubRoutes = route => {
	return (
		<Route
			exact={route.exact}
			path={route.path}
			render={() => (
				// pass the sub-routes down to keep nesting
				<route.component routes={route.routes} />
			)}
		/>
	)
}

export default RouteWithSubRoutes
