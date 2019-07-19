import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { Icon, Button, Col, Row, Tabs, Card, Select, Typography } from 'antd'
// import logo from '../../../assets/images/logo.svg'
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { menuRoutes } from '../../../routes'

const { TabPane } = Tabs
const { Option } = Select
const { Title } = Typography

const gridStyle = {
	width: '100%',
	height: '20vh',
	marginBottom: '10%',
	display: 'flex',
	alignItems: 'center',
	backgroundColor: '#ffffff'
}

function Dashboard(props) {
	const [me, setMe] = useState('')
	const [currentsite, setCurrentsite] = useState(
		window.localStorage.getItem('currentsite')
	)

	useEffect(() => {
		// code to run on component mount
		props.client
			.query({ query: ME })
			.then(res => {
				// console.log(res.data.me)
				setMe(res.data.me)
			})
			.catch(err => {
				console.log(err)
			})
	})

	function onLogout() {
		props.store.authStore.logout()
		props.client.resetStore()
		props.history.push('/login')
	}

	function handleChange(value) {
		// console.log(`selected ${value}`)
		setCurrentsite(value)
		window.localStorage.setItem('currentsite', value)
	}

	const operations = (
		<>
			<Select
				defaultValue={currentsite}
				style={{ width: 180, marginRight: '5vw' }}
				onChange={handleChange}
			>
				{JSON.parse(window.localStorage.getItem('user-permissions')).map(
					item => (
						<Option key={item.siteId} value={item.siteId}>
							{item.siteName}
						</Option>
					)
				)}
			</Select>
		</>
	)

	return (
		<Tabs
			tabBarStyle={{ margin: 0, color: '#ffffff' }}
			defaultActiveKey="1"
			tabBarExtraContent={operations}
		>
			<TabPane tab="Home" key="1">
				<Row
					style={{
						height: 'calc(100vh - 60px)'
					}}
				>
					<Card
						title={
							<Title style={{ color: '#ffffff' }} level={3}>
								Quick actions
							</Title>
						}
						bordered={false}
						headStyle={{
							border: 0,
							margin: 0
						}}
						bodyStyle={{}}
						style={{ backgroundColor: 'transparent' }}
					>
						{menuRoutes.map(
							item =>
								JSON.parse(window.localStorage.getItem('user-permissions'))
									.filter(item1 => item1.siteId === currentsite)[0]
									.permissions.map(item2 => item2.code.split('_')[0])
									.filter(item3 => item3 === item.code).length > 0 && (
									<Col
										key={item.label}
										xs={{
											span: 10,
											offset: 1
										}}
										sm={{
											span: 10,
											offset: 1
										}}
										md={{
											span: 10,
											offset: 1
										}}
										lg={{
											span: 4,
											offset: 1
										}}
										onClick={() => {
											props.history.push(item.path)
										}}
									>
										<Card.Grid id={item.id} style={gridStyle}>
											{item.label}
											<Icon
												style={{
													paddingLeft: '10px'
												}}
												type={item.icon}
											/>
										</Card.Grid>
									</Col>
								)
						)}
					</Card>
				</Row>
			</TabPane>
			<TabPane tab="User" key="2">
				<Row
					style={{
						height: 'calc(100vh - 60px)'
					}}
				>
					<Col
						xs={{
							span: 20,
							offset: 2
						}}
						sm={{
							span: 10,
							offset: 1
						}}
						md={{
							span: 10,
							offset: 1
						}}
						lg={{
							span: 4,
							offset: 1
						}}
					>
						<Title style={{ color: '#ffffff', marginTop: 15 }} level={4}>
							Hello, {me && me.username}
						</Title>
						<Button type="primary" block onClick={onLogout} icon="logout">
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

export default withApollo(withRouter(inject('store')(observer(Dashboard))))
