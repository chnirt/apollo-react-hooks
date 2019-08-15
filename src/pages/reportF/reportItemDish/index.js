import React from 'react'
// import { compose, graphql } from 'react-apollo'
import { withTranslation } from 'react-i18next'
// import gql from 'graphql-tag'
import { Collapse, Button } from 'antd'
// import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

import UserDish from '../reportUserDish'
import '../index.css'

const { Panel } = Collapse

function ReportItemDish(props) {
	const { name, me, menu, _id, onPlus, onMinus } = props
	const max = menu
		.filter(order => order.dishId === _id)
		.map(order => order.count)
		.reduce((a, b) => a + b)
	const currentCount = menu.filter(
		order => order.dishId === _id && order.userId === me._id
	)[0].count
	return (
		<React.Fragment>
			<Collapse>
				<Panel
					header={`${name} x ${max}`}
					extra={
						<Button
							className="btn-report"
							icon="plus"
							type="link"
							shape="circle"
							onClick={e => onPlus(e, _id, currentCount)}
							style={{ bottom: '5px' }}
						/>
					}
				>
					{menu
						.filter(order => order.dishId === _id && order.count !== 0)
						.map(order => (
							<UserDish key={order._id} {...order} onMinus={onMinus} />
						))}
				</Panel>
			</Collapse>
		</React.Fragment>
	)
}

export default withTranslation('translations')(ReportItemDish)
