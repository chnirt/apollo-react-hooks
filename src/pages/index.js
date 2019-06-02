import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { routes } from '../routes'
import { Auth } from '../auth'
// import withLoadable from '../utils/loadable'

function Root() {
	return (
		<BrowserRouter>
			<Switch>
				{routes &&
					routes.map((route, i) =>
						route.private ? (
							// Private
							<Route
								key={i}
								{...route}
								component={props => {
									// const MyComponent = withLoadable(
									// 	import(`./${route.component}`)
									// )
									return Auth.isAuthenticated ? (
										<route.import {...props} {...route} />
									) : (
										// <MyComponent {...props} {...route} />
										<Redirect to="/login" />
									)
								}}
							/>
						) : (
							// Not private
							<Route
								key={i}
								{...route}
								component={props => {
									// const MyComponent = withLoadable(
									// 	import(`./${route.component}`)
									// )
									return !Auth.isAuthenticated ? (
										<route.import {...props} {...route} />
									) : (
										// <MyComponent {...props} {...route} />
										<Redirect to="/" />
									)
								}}
							/>
						)
					)}
			</Switch>
		</BrowserRouter>
	)
}

export default Root
