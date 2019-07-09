import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import withLoadable from '../../tools/loadable'
import Layout from './layout'

export default function Root(props) {
	return (
		// <Layout routes={props.routes}>
		<Switch>
			{props.routes &&
				props.routes.map((route, i) => (
					<Route
						key={i}
						{...route}
						component={props => {
							const MyComponent = withLoadable(import(`./${route.component}`))
							return <MyComponent {...props} {...route} routes={route.routes} />
						}}
					/>
				))}
			<Redirect to="/🥢" />
		</Switch>
		// </Layout>
	)
}
