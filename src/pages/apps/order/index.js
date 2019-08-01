import React from 'react'
import { Typography, Col, Row } from 'antd'
import ListDishesAndActions from './lishDishesAndActions'

const Order = () => {
	return (
		<React.Fragment>
			<Row
				style={{
					overflow: 'hidden',
					marginTop: 10
				}}
			>
				<Col span={22} offset={1}>
					<Typography.Title
						level={3}
						style={{
							color: '#fff'
						}}
					>
						Đặt món
					</Typography.Title>
					<ListDishesAndActions />
				</Col>
			</Row>
		</React.Fragment>
	)
}

export default Order
