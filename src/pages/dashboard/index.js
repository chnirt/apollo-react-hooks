import React, { useState } from 'react'
import { Icon, Col, Row, Card, Typography } from 'antd'
import { menuRoutes } from '../../routes'

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
	const [currentsite] = useState(window.localStorage.getItem('currentsite'))

	const { t } = props
	const common = 'src.pages.common'
	const dashBoard = 'src.pages.dashBoard'
	return (
		<>
			<Row
				style={{
					height: 'calc(100vh - 60px)'
				}}
			>
				<Card
					title={
						<Title style={{ color: '#ffffff' }} level={3}>
							{t(`${common}.quickActions`)}
						</Title>
					}
					bordered={false}
					headStyle={{
						border: 0,
						margin: 0
					}}
					bodyStyle={{
						padding: 0
					}}
					style={{ backgroundColor: 'transparent' }}
				>
					{menuRoutes.map(
						item =>
							JSON.parse(window.localStorage.getItem('user-permissions'))
								.filter(item1 => item1.siteId === currentsite)[0]
								.sitepermissions.filter(item3 => item3 === item.code).length >
								0 && (
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
										<Icon
											style={{
												paddingRight: '10px'
											}}
											type={item.icon}
										/>
										{t(`${dashBoard}.${item.label}`)}
									</Card.Grid>
								</Col>
							)
					)}
				</Card>
			</Row>
		</>
	)
}

export default Dashboard
