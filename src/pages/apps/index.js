import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import withLoadable from '../../tools/loadable'

export default function Home(props) {
	return (
		<>
			<Switch>
				{props.routes &&
					props.routes.map((route, i) => (
						<Route
							key={i}
							{...route}
							component={props => {
								const MyComponent = withLoadable(import(`./${route.component}`))
								return <MyComponent {...props} {...route} />
							}}
						/>
					))}
			</Switch>
		</>
	)
}
