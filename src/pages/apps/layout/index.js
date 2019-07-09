import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { Icon, Drawer, Button, Col, Row, Tabs, Card } from 'antd'
// import logo from '../../../assets/images/logo.svg'
import { withRouter, Link } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'

const { TabPane } = Tabs

const gridStyle = {
	width: '100%',
	height: '20vh',
	marginBottom: '10%',
	display: 'flex',
	alignItems: 'center'
}

function Layout(props) {
	const [visible, setVisible] = useState(false)
	const [me, setMe] = useState('')

	useEffect(() => {
		// code to run on component mount
		props.client
			.query({ query: ME })
			.then(res => {
				// console.log(res.data.me)
				setMe(res.data.me)
			})
			.catch(err => {
				// console.log(err)
			})
	})

	function showDrawer(path) {
		props.history.push(path)
		setVisible(true)
	}

	function onClose() {
		props.history.goBack()
		setVisible(false)
	}

	function onLogout() {
		props.store.authStore.logout()
		props.client.resetStore()
		props.history.push('/login')
	}

	// console.log(props)

	return (
		<Tabs defaultActiveKey="1">
			<TabPane tab="Home" key="1">
				<Row style={{ height: 'calc(100vh - 60px)' }}>
					<Card
						title="Quick actions"
						bordered={false}
						headStyle={{
							border: 0,
							margin: 0
						}}
					>
						{props.children.props.routes
							.filter(item => item.exact !== true)
							.map((item, i) => (
								<Col
									key={i}
									xs={{ span: 10, offset: 1 }}
									sm={{ span: 10, offset: 1 }}
									md={{ span: 10, offset: 1 }}
									lg={{ span: 4, offset: 1 }}
									onClick={() => showDrawer(item.path)}
								>
									<Card.Grid style={gridStyle}>
										{item.label}
										<Icon
											style={{
												paddingLeft: '10px'
											}}
											type={item.icon}
										/>
									</Card.Grid>
								</Col>
							))}
					</Card>
					<Drawer
						title="Basic Drawer"
						width={'100%'}
						placement="right"
						closable={true}
						onClose={onClose}
						visible={visible}
					>
						{props.children}
					</Drawer>
				</Row>
			</TabPane>
			<TabPane tab="User" key="2">
				<Row type="flex" justify="center" style={{ height: '100vh' }}>
					<Col
						xs={{ span: 10, offset: 1 }}
						sm={{ span: 10, offset: 1 }}
						md={{ span: 10, offset: 1 }}
						lg={{ span: 4, offset: 1 }}
					>
						Hello, {me && me.username}
						<Button type="primary" block onClick={onLogout}>
							Log out
						</Button>
					</Col>
				</Row>
			</TabPane>
		</Tabs>
	)
}

const ME = gql`
	query {
		me {
			username
		}
	}
`

export default inject('store')(observer(withApollo(withRouter(Layout))))
