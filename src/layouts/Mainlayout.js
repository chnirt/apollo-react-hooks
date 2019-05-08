import React, { Component } from 'react'
import Headerlayout from './Headerlayout'
import Siderlayout from './Siderlayout'
import Breadcumblayout from './Breadcumblayout'
import Footerlayout from './Footerlayout'
import './Mainlayout.scss'

import { Layout, BackTop } from 'antd'
const { Content } = Layout

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
					<Siderlayout />
					<Layout>
						{/* <Header style={{ background: '#fff', padding: 0 }} /> */}
						<Headerlayout />
						{/* Breadcumb */}
						<Breadcumblayout />
						{/* Content */}
						<Content style={{ margin: '0px 16px 0' }}>
							<div
								style={{ padding: 24, background: '#fff', minHeight: '80vh' }}
							>
								{this.props.children}
							</div>
						</Content>
						{/* <Footer style={{ textAlign: 'center' }}>
							Ant Design ©2018 Created by Ant UED
						</Footer> */}
						{/* Footer */}
						<Footerlayout />
						{/* BackTop */}
						<BackTop />
					</Layout>
				</Layout>
			</>
		)
	}
}

export default Main
