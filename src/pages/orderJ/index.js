import React from 'react'
import { Col, Row } from 'antd'
import './orderJ.css'
import OrderDishList from './OrderDishList'

function orderJ(props) {
	const siteId = localStorage.getItem('currentsite')

	console.log(props)

	const LAYOUT = {
		xs: { span: 24, offset: 0 },
		sm: { span: 20, offset: 2 },
		md: { span: 18, offset: 3 },
		lg: { span: 16, offset: 4 },
		xl: { span: 10, offset: 7 }
	}

	return (
		<React.Fragment>
			<div style={{ margin: '0px 20px 0px 20px' }}>
				<Row>
					<Col {...LAYOUT}>
						<OrderDishList siteId={siteId} />
					</Col>
				</Row>
			</div>
		</React.Fragment>
	)
}

export default orderJ
