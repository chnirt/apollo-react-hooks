import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
// import Headerlayout from './Headerlayout'
// import Siderlayout from './Siderlayout'
import Breadcumblayout from './Breadcumblayout'
import Footerlayout from './Footerlayout'
import './Mainlayout.scss'
import {
	LocaleProvider,
	Layout,
	Menu,
	Typography,
	Avatar,
	Icon,
	Drawer,
	Affix,
	Button,
	BackTop
} from 'antd'
import logo from '../../../assets/images/logo.svg'
import { siderRoutes, headerRoutes } from '../../../routes'
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { withTranslation } from 'react-i18next'

const { Title } = Typography
const { Header, Content, Sider } = Layout
const SubMenu = Menu.SubMenu

@inject('store')
@observer
class Main extends Component {
	state = {
		current: '/👻',
		isMobile: false,
		collapsed: false,
		collapsedWidth: 80,
		visible: false,
		rightVisible: false,
		headerWidth: 256,
		me: {}
	}

	toggle = () => {
		// console.log('toggle')
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

	toggleRightDrawer = () => {
		// console.log('toggleRight')
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
		// console.log('handleClick ')
		this.setState({
			current: e.key
		})
		this.props.history.push(e.key)
	}

	componentDidMount() {
		this.props.client
			.query({ query: ME })
			.then(res => {
				// console.log(res.data.me)
				this.setState({
					me: res.data.me
				})
			})
			.catch(err => console.log(err))
	}

	changeLocale = key => {
		if (key === 'vi') {
			this.props.i18n.changeLanguage('vi')
			this.props.store.i18nStore.changeLanguage('vi')
		} else {
			this.props.i18n.changeLanguage('en')
			this.props.store.i18nStore.changeLanguage('en')
		}
	}

	onLogout = () => {
		this.props.store.authStore.logout()
		this.props.client.resetStore()
		this.props.history.push('/login')
	}

	render() {
		return (
			<LocaleProvider locale={this.props.store.i18nStore.locale}>
				<Layout id="components-layout-demo-custom-trigger">
					{/* Sider Mobile */}
					<Drawer
						title={this.props.t('menu').toUpperCase()}
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
										<Icon type={siderRoute.icon} />
										<span>{this.props.t(siderRoute.label).toUpperCase()}</span>
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
							transition: 'all .2s'
							// boxShadow: '2px 0 6px rgba(0,21,41,.35)'
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
							// console.log(collapsed, type)
						}}
					>
						{/* Logo */}
						<div className="logo">
							<img src={logo} alt="logo" />
							<Title level={1}>Luncheon</Title>
						</div>
						<Menu
							theme="light"
							mode="inline"
							onClick={this.handleClick}
							selectedKeys={[this.props.location.pathname]}
						>
							{siderRoutes &&
								siderRoutes.map((siderRoute, i) => (
									<Menu.Item key={siderRoute.path}>
										<Icon type={siderRoute.icon} />
										<span>{this.props.t(siderRoute.label).toUpperCase()}</span>
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
							<h1 style={{ display: 'inline-block', marginLeft: 10 }} onClick={() => window.history.back()}>
								<Icon type="arrow-left" />
							</h1>

							<Icon
								className="trigger"
								type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
								onClick={this.toggle}
							/>
							<Menu
								mode="horizontal"
								style={{
									float: 'right',
									lineHeight: '63px'
								}}
							>
								{/* LanguageMenu */}
								<SubMenu
									title={<Icon type="global" style={{ marginRight: 0 }} />}
								>
									<Menu.Item onClick={() => this.changeLocale('en')}>
										{/* <span role="img">🇺🇸</span> */}
										English
									</Menu.Item>
									<Menu.Item onClick={() => this.changeLocale('vi')}>
										{/* <span role="img">🇻🇳</span> */}
										Việt Nam
									</Menu.Item>
								</SubMenu>
								{/* AccountMenu */}
								<SubMenu
									title={
										<>
											<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
											<span>
												{this.props.t('hello').toUpperCase()}
												{this.state.me && this.state.me.username}
											</span>
										</>
									}
									style={{ marginRight: 10 }}
								>
									{headerRoutes &&
										headerRoutes.map((headerRoute, i) => (
											<Menu.Item
												key={headerRoute.path}
												onClick={e => this.props.history.push(headerRoute.path)}
											>
												<Icon type={headerRoute.icon} />
												{this.props.t(headerRoute.label).toUpperCase()}
											</Menu.Item>
										))}
									<Menu.Divider />
									<Menu.Item onClick={this.onLogout}>
										<Icon type="logout" />
										{this.props.t('logout').toUpperCase()}
									</Menu.Item>
								</SubMenu>
							</Menu>
						</Header>
						{/* Content */}
						<Content
							style={{
								margin: '24px 16px 0px',
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
									minHeight: 'calc( 100vh - 191px )'
								}}
							>
								{this.props.children}
							</div>
							{/* Footer */}
							<Footerlayout />
							{/* BackTop */}
							<BackTop />
						</Content>
					</Layout>
				</Layout>
			</LocaleProvider>
		)
	}
}

const ME = gql`
	query {
		me {
			_id
			email
			username
		}
	}
`

export default withApollo(withTranslation()(withRouter(Main)))
