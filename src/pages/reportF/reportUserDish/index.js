import React from 'react'
import { compose, graphql } from 'react-apollo'
import { withTranslation } from 'react-i18next'
import { Button } from 'antd'
// import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

import { USER } from '../reportQuery/reportQuery'
import '../index.css'

function UserDish(props) {
	const { count, dishId, userId, getFullname, onMinus } = props
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginBottom: 10
			}}
		>
			{getFullname.user && getFullname.user.fullName} x {count}{' '}
			<Button
				className="btn-report"
				type="link"
				icon="minus"
				shape="circle"
				onClick={() => onMinus(userId, dishId, count)}
			/>
		</div>
	)
}

export default compose(
	graphql(USER, {
		name: 'getFullname',
		skip: props => !props.userId,
		options: props => ({
			variables: {
				_id: props.userId
			}
		})
	})
)(withTranslation('translations')(UserDish))
