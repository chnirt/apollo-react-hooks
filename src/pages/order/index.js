import React from 'react'
import { Typography, Col, Row } from 'antd'
import { withTranslation } from 'react-i18next'
import ListDishesAndActions from './lishDishesAndActions'

const Order = props => {
	const { t } = props
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
						{t('Order')}
					</Typography.Title>
					<ListDishesAndActions />
				</Col>
			</Row>
		</React.Fragment>
	)
}

export default withTranslation('translations')(Order)
