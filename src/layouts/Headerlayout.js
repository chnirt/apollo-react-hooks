import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Layout, Menu, Icon, Avatar } from 'antd'
import { headerRoutes } from '../routes'
import Auth from '../auth/Authenticate'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'

const { Header } = Layout

const SubMenu = Menu.SubMenu

class Headerlayout extends Component {
	constructor(props) {
		super(props)
		this.state = {
			me: {}
		}
	}

	componentDidMount() {
		const { client } = this.props
		client
			.query({ query: ME })
			.then(res => {
				console.log(res.data.me)
				this.setState({
					me: res.data.me
				})
			})
			.catch(err => console.log(err))
	}
	onLogout = () => {
		const { history } = this.props
		Auth.logout(() => {
			localStorage.removeItem('access-token')
			history.push('/login')
		})
	}
	render() {
		const { location } = this.props
		const { me } = this.state
		return (
			<Header
				id="components-layout-demo-fixed"
				style={{
					background: '#ffff',
					position: 'fixed',
					zIndex: '1',
					width: '100%',
					boxShadow: '0px 0px 5px 0px rgba(50, 50, 50, 0.75)'
				}}
			>
				<div className="logo" />
				<Menu
					mode="horizontal"
					style={{ float: 'right', lineHeight: '62px' }}
					defaultSelectedKeys={[location.pathname]}
					selectable={false}
				>
					<SubMenu
						key="sub1"
						title={
							<span>
								<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
								<span>{me && me.username}</span>
							</span>
						}
					>
						{headerRoutes &&
							headerRoutes.map((headerRoute, i) => (
								<Menu.Item key={i}>
									<Link to={headerRoute.path}>
										<Icon type={headerRoute.icon} />
										{headerRoute.label.toUpperCase()}
									</Link>
								</Menu.Item>
							))}
						<Menu.Divider />
						<Menu.Item onClick={this.onLogout}>
							<Icon type="logout" />
							LOG OUT
						</Menu.Item>
					</SubMenu>
				</Menu>
			</Header>
		)
	}
}

const ME = gql`
	query {
		me {
			_id
			email
			username
			firstLetterOfEmail
		}
	}
`

export default withApollo(withRouter(Headerlayout))
