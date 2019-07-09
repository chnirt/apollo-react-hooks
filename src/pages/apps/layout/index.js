import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { LocaleProvider, Icon, Drawer, Button, Col, Row, Tabs, Card } from 'antd'
// import logo from '../../../assets/images/logo.svg'
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { withTranslation } from 'react-i18next'

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
		setVisible(false)
	}

	function onLogout() {
		props.store.authStore.logout()
		props.client.resetStore()
		props.history.push('/login')
	}

	return (
		<LocaleProvider locale={props.store.i18nStore.locale}>
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
							{props.children.props.routes.map((item, i) => (
								<Col
									key={i}
									xs={{ span: 10, offset: 1 }}
									sm={{ span: 10, offset: 1 }}
									md={{ span: 10, offset: 1 }}
									lg={{ span: 4, offset: 1 }}
									onClick={() => showDrawer(item.path)}
								>
									<Card.Grid style={gridStyle}>
										{item.content}
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
		</LocaleProvider>
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
