import React, { Component } from 'react'
// import Headerlayout from './Headerlayout'
// import Siderlayout from './Siderlayout'
import Breadcumblayout from './Breadcumblayout'
import Footerlayout from './Footerlayout'
import './Mainlayout.scss'
import { Layout, Menu, Avatar, Icon, Drawer, Affix, Button, BackTop } from 'antd'
import logo from '../../../assets/images/logo.svg'
import { siderRoutes, headerRoutes } from '../../../routes'
import { Link, withRouter } from 'react-router-dom'
import Auth from '../../../auth/Authenticate'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'

const { Header, Content, Sider } = Layout
const SubMenu = Menu.SubMenu

class Main extends Component {
	state = {
		current: '/',
		isMobile: false,
		collapsed: false,
		collapsedWidth: 80,
		visible: false,
		rightVisible: false,
		headerWidth: 256,
		me: {}
	}

	toggle = () => {
		console.log('toggle')
		if (this.state.isMobile === false) {
			if (this.state.collapsed) {
				this.setState({
					headerWidth: 256
				})
			} else {
				this.setState({
					headerWidth: 80
				})
			}
			this.setState({
				collapsed: !this.state.collapsed
			})
		} else {
			this.setState({
				visible: true
			})
		}
	}

	toggoleRightDrawer = () => {
		console.log('toggleRight')
		this.setState({
			rightVisible: !this.state.rightVisible
		})
	}

	showDrawer = () => {
		this.setState({
			visible: true
		})
	}

	onClose = () => {
		this.setState({
			visible: false,
			rightVisible: false
		})
	}

	handleClick = e => {
		console.log('handleClick ')
		this.setState({
			current: e.key
		})
	}

	componentDidMount() {
		console.log('componentDidMount ')
		this.props.client
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
		Auth.logout(() => {
			window.localStorage.removeItem('access-token')
			this.props.history.push('/login')
			this.props.client.resetStore()
		})
	}

	render() {
		return (
			<>
				<Layout id="components-layout-demo-custom-trigger">
					{/* Sider Mobile */}
					<Drawer
						title="Menu"
						placement="left"
						closable={false}
						onClose={this.onClose}
						visible={this.state.visible}
						bodyStyle={{ padding: '0px' }}
					>
						<Menu
							mode="inline"
							onClick={this.handleClick}
							defaultSelectedKeys={[this.props.location.pathname]}
							style={{ width: 256 }}
						>
							{siderRoutes &&
								siderRoutes.map((siderRoute, i) => (
									<Menu.Item key={siderRoute.path}>
										<Link to={siderRoute.path}>
											<Icon type={siderRoute.icon} />
											<span>{siderRoute.label.toUpperCase()}</span>
										</Link>
									</Menu.Item>
								))}
						</Menu>
					</Drawer>
					{/* Sider Laptop */}
					<Sider
						breakpoint="xs"
						collapsible
						collapsed={this.state.collapsed}
						defaultCollapsed={this.state.collapsed}
						reverseArrow={true}
						style={{
							// backgroundColor: "transparent",
							position: 'fixed',
							top: 0,
							left: 0,
							zIndex: 10,
							minHeight: '100vh',
							transition: 'all .2s',
							boxShadow: '2px 0 6px rgba(0,21,41,.35)'
						}}
						theme="light"
						trigger={null}
						width={256}
						collapsedWidth={this.state.collapsedWidth}
						onBreakpoint={broken => {
							// console.log('broken', broken)
							if (broken) {
								this.setState({
									isMobile: true,
									collapsed: true,
									collapsedWidth: 0,
									headerWidth: 0
								})
							} else {
								this.setState({
									isMobile: false,
									collapsed: false,
									collapsedWidth: 80,
									visible: false,
									headerWidth: 256
								})
							}
						}}
						onCollapse={(collapsed, type) => {
							console.log(collapsed, type)
						}}
					>
						{/* Logo */}
						<div className="logo">
							<img src={logo} alt="logo" />
							<h1>Chnirt</h1>
						</div>
						<Menu
							theme="light"
							mode="inline"
							onClick={this.handleClick}
							defaultSelectedKeys={[this.props.location.pathname]}
						>
							{siderRoutes &&
								siderRoutes.map((siderRoute, i) => (
									<Menu.Item key={siderRoute.path}>
										<Link to={siderRoute.path}>
											<Icon type={siderRoute.icon} />
											<span>{siderRoute.label.toUpperCase()}</span>
										</Link>
									</Menu.Item>
								))}
						</Menu>
					</Sider>
					<Layout
						style={{
							minHeight: '100vh',
							paddingLeft: `${this.state.headerWidth}px`
						}}
					>
						{/* Header */}
						<Header
							style={{
								position: 'fixed',
								top: 0,
								right: 0,
								// zIndex: 9,
								// width: '100%',
								transition: 'all .2s',
								// padding: '0px',
								width: `calc(100% - ${this.state.headerWidth}px)`,
								zIndex: 2,
								background: '#fff',
								padding: '0px',
								boxShadow: '0 1px 4px rgba(0,21,41,.08)'
							}}
						>
							<Icon
								className="trigger"
								type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
								onClick={this.toggle}
							/>
							<Menu
								// onClick={this.handleClick}
								mode="horizontal"
								style={{
									float: 'right',
									lineHeight: '63px'
								}}
								// defaultSelectedKeys={[this.props.location.pathname]}
							>
								<SubMenu
									key="hsub1"
									title={
										<>
											<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
											<span>{this.state.me && this.state.me.username}</span>
										</>
									}
								>
									{headerRoutes &&
										headerRoutes.map((headerRoute, i) => (
											<Menu.Item key={`h${i}`}>
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
						{/* Content */}
						<Content
							style={{
								margin: '24px 16px 16px',
								paddingTop: '40px',
								overflow: 'initial'
							}}
						>
							{/* Breadcumb */}
							<Breadcumblayout />
							<div
								style={{
									padding: 24,
									background: '#fff',
									minHeight: 'calc( 100vh - 207px )'
								}}
							>
								{this.props.children}
							</div>
							{/* Footer */}
							<Footerlayout />
							{/* BackTop */}
							<BackTop />
						</Content>
						{/* Custom theme */}
						<Affix
							offsetTop={120}
							style={{
								position: 'absolute',
								right: 0
							}}
							onChange={affixed => {
								// console.log("affixed", affixed)
							}}
						>
							{!this.state.rightVisible && (
								<Button
									type="primary"
									icon="setting"
									size="large"
									onClick={this.toggoleRightDrawer}
									style={{ borderRadius: '4px 0 0 4px' }}
								/>
							)}
						</Affix>
						<Drawer
							title="Custom theme"
							width={300}
							placement="right"
							closable={false}
							onClose={this.onClose}
							visible={this.state.rightVisible}
						>
							<Button
								className="antd-pro-components-setting-drawer-index-handle"
								type="primary"
								icon={!this.state.rightVisible ? 'setting' : 'close'}
								size="large"
								onClick={this.toggoleRightDrawer}
							/>
						</Drawer>
					</Layout>
				</Layout>
			</>
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

export default withApollo(withRouter(Main))
