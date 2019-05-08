import React, { Component } from 'react'
import Headerlayout from './Headerlayout'
import Siderlayout from './Siderlayout'
import Breadcumblayout from './Breadcumblayout'
import Footerlayout from './Footerlayout'
import './Mainlayout.scss'

// import { Layout, BackTop } from 'antd'

// const { Content } = Layout

import { Layout, Menu, Icon, BackTop } from 'antd'
const { Header, Sider, Content, Footer } = Layout

class Main extends Component {
	state = {
		collapsed: false
	}

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed
		})
	}
	render() {
		return (
			<>
				<Layout>
					{/* Header */}
					<Headerlayout />
					{/* Body */}
					<Layout style={{ marginTop: 64 }}>
						{/* Sider */}
						<Siderlayout />
						{/* Content */}
						<Layout style={{ marginLeft: 200 }}>
							{/* Breadcumb */}
							<Breadcumblayout />
							{/* Component */}
							<Content
								style={{
									margin: '0px 16px 0 16px',
									overflow: 'auto'
								}}
							>
								<div
									style={{
										padding: 24,
										background: '#fff',
										minHeight: '81vh'
									}}
								>
									{this.props.children}
									<BackTop />
								</div>
							</Content>
							{/* Footer */}
							<Footerlayout />
						</Layout>
					</Layout>
				</Layout>
				{/* <Layout>
					<Sider
						breakpoint="lg"
						collapsedWidth="0"
						onBreakpoint={broken => {
							console.log(broken)
						}}
						onCollapse={(collapsed, type) => {
							console.log(collapsed, type)
						}}
					>
						<div className="logo" />
						<Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
							<Menu.Item key="1">
								<Icon type="user" />
								<span className="nav-text">nav 1</span>
							</Menu.Item>
							<Menu.Item key="2">
								<Icon type="video-camera" />
								<span className="nav-text">nav 2</span>
							</Menu.Item>
							<Menu.Item key="3">
								<Icon type="upload" />
								<span className="nav-text">nav 3</span>
							</Menu.Item>
							<Menu.Item key="4">
								<Icon type="user" />
								<span className="nav-text">nav 4</span>
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout>
						<Header style={{ background: '#fff', padding: 0 }} />
						<Content style={{ margin: '24px 16px 0' }}>
							<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
								content
							</div>
						</Content>
						<Footer style={{ textAlign: 'center' }}>
							Ant Design ©2018 Created by Ant UED
						</Footer>
					</Layout>
				</Layout> */}
			</>
		)
	}
}

export default Main
