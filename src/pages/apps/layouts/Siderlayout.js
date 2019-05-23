import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'
import { siderRoutes } from '../../../routes'
import './Siderlayout.scss'

const { Sider } = Layout

class Siderlayout extends React.Component {
	state = {
		currentRoute: '/'
	}

	handleClick = e => {
		// console.log('click ', e)
		this.setState({
			current: e.key
		})
	}
	render() {
		const { location } = this.props
		return (
			<Sider
				id="components-layout-demo-responsive"
				theme="light"
				style={{ boxShadow: '1px 0px 0px 0px rgba(50, 50, 50, 0.5)' }}
				breakpoint="lg"
				collapsedWidth="0"
				onBreakpoint={broken => {
					console.log(broken)
				}}
				onCollapse={(collapsed, type) => {
					console.log(collapsed, type)
				}}
			>
				<div style={{ border: 'red 1px solid' }} className="logo" />
				<Menu
					mode="inline"
					defaultSelectedKeys={[location.pathname]}
					onClick={e => this.handleClick(e)}
				>
					{siderRoutes &&
						siderRoutes.map((siderRoute, i) => (
							<Menu.Item key={siderRoute.path}>
								<Link to={siderRoute.path}>
									<Icon type={siderRoute.icon} />
									{siderRoute.label.toUpperCase()}
								</Link>
							</Menu.Item>
						))}
				</Menu>
			</Sider>
		)
	}
}

export default withRouter(Siderlayout)
