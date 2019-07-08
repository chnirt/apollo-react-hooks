import React, { useState } from 'react'
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

function Main(props) {
	console.log(props)
	const [visible, setVisible] = useState(false)

	function showDrawer(path) {
		props.history.push(path)
		setVisible(true)
	}

	function onClose() {
		setVisible(false)
	}

	// function changeLocale(key) {
	// 	if (key === 'vi') {
	// 		props.i18n.changeLanguage('vi')
	// 		props.store.i18nStore.changeLanguage('vi')
	// 	} else {
	// 		props.i18n.changeLanguage('en')
	// 		props.store.i18nStore.changeLanguage('en')
	// 	}
	// }

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
							Hello, Admin
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

export default inject('store')(
	observer(withApollo(withTranslation()(withRouter(Main))))
)
