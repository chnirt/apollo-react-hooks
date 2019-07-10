import React from 'react'
import { inject, observer } from 'mobx-react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { routes } from '../routes'
import withLoadable from '../tools/loadable'
import Layouts from './apps/layouts'

function Root(props) {
	const { isAuth } = props.store.authStore
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
									const MyComponent = withLoadable(
										import(`./${route.component}`)
									)
									return isAuth ? (
										<Layouts>
											<MyComponent {...props} {...route} />
										</Layouts>
									) : (
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
									const MyComponent = withLoadable(
										import(`./${route.component}`)
									)
									return !isAuth ? (
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
// export default Root
export default inject('store')(observer(Root))
