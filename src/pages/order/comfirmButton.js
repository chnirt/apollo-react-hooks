import React, { useState } from 'react'
import { Row, Button, Alert } from 'antd'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

function ConfirmButton(props) {
	const [alert, setAlert] = useState(false)

	function handleConfirmOrder() {
		const thisOrderIds = []
		// eslint-disable-next-line no-unused-expressions
		props.ordersByUser &&
			props.ordersByUser.ordersByUser.map(order => thisOrderIds.push(order._id))
		props
			.confirmOrder({
				variables: {
					orderIds: thisOrderIds
				}
			})
			.then(res => {
				if (res) {
					setAlert(true)
				} else {
					openNotificationWithIcon('error', 'alert-confirm', t('Failed'), '')
				}
			})
			.catch(() => {
				openNotificationWithIcon('error', 'confirm', t('Failed'), '')
			})
	}

	const time = new Date(Date.now()).getHours()
	const { t } = props
	const confirmButton =
		time > 11 && time < 15 ? (
			<Button
				onClick={handleConfirmOrder}
				id="confirm-order"
				style={{
					display: 'block',
					textAlign: 'center',
					marginTop: 20,
					marginBottom: 20
				}}
				type="submit"
			>
				{t('Confirm')}
			</Button>
		) : null
	return (
		<React.Fragment>
			{alert === true ? (
				<Alert
					message={t('ConfirmSuccess')}
					type="success"
					showIcon
					closable
					style={{
						marginTop: 20
					}}
				/>
			) : null}
			<Row type="flex" justify="center" align="bottom">
				{confirmButton}
			</Row>
		</React.Fragment>
	)
}

const CONFIRM_ORDER = gql`
	mutation confirmOrder($orderIds: [String]) {
		confirmOrder(orderIds: $orderIds)
	}
`

const ORDERS_BY_USER = gql`
	query ordersByUser($menuId: String!) {
		ordersByUser(menuId: $menuId) {
			_id
			userId
			menuId
			dishId
			note
			count
			isConfirmed
			createdAt
			updatedAt
		}
	}
`

export default compose(
	graphql(ORDERS_BY_USER, {
		name: 'ordersByUser',
		skip: props => !props.menuId,
		options: props => ({
			variables: {
				menuId: props.menuId
			}
		})
	}),
	graphql(CONFIRM_ORDER, {
		name: 'confirmOrder'
	})
)(ConfirmButton)
