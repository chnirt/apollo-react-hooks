import React, { Component } from 'react'
import RouteWithSubRoutes from '../utils/RouteWithSubRoutes'
import Main from '../layouts/Mainlayout'
import { Switch, Redirect } from 'react-router-dom'

export class Home extends Component {
	render() {
		const { routes } = this.props
		return (
			<>
				<Main>
					<Switch>
						{routes &&
							routes.map((route, i) => (
								<RouteWithSubRoutes key={i} {...route} />
							))}
						<Redirect to="/" />
					</Switch>
				</Main>
			</>
		)
	}
}

export default Home
