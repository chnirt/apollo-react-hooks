import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { routes } from '../routes'
import { Auth } from '../auth'
import Main from './apps/layouts/Mainlayout'
import withLoadable from '../utils/loadable'

function Root() {
	return (
		<BrowserRouter>
			<Switch>
				{routes &&
					routes.map((route, i) =>
						route.private ? (
							// Private
							<Main key={i}>
								<Route
									{...route}
									component={props => {
										const MyComponent = withLoadable(
											import(`./${route.component}`)
										)
										return Auth.isAuthenticated ? (
											<MyComponent {...props} {...route} />
										) : (
											<Redirect to="/login" />
										)
									}}
								/>
							</Main>
						) : (
							// Not private
							<Route
								key={i}
								{...route}
								component={props => {
									const MyComponent = withLoadable(
										import(`./${route.component}`)
									)
									return !Auth.isAuthenticated ? (
										<MyComponent {...props} {...route} />
									) : (
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
