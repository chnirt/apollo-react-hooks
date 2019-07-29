import React from 'react'
import { Typography } from 'antd'
import ListDishesAndActions from './lishDishesAndActions'

const Order = () => {
	return (
		<React.Fragment>
			<div
				style={{
					overflow: 'hidden',
					marginTop: 10
				}}
			>
				<Typography.Title
					style={{
						color: '#fff',
						display: 'block',
						textAlign: 'center'
					}}
					level={2}
				>
					Đặt món
				</Typography.Title>
				<ListDishesAndActions />
			</div>
		</React.Fragment>
	)
}

export default Order
