import React, { useState } from 'react'
import { Row, Button, Alert } from 'antd'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

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

const ConfirmButton = props => {
	const [alert, setAlert] = useState(false)

	async function handleConfirmOrder() {
		await props.client
			.query({
				query: ORDERS_BY_USER,
				variables: {
					menuId: props.menuId
				}
			})
			.then(async result => {
				const thisOrderIds = []
				await result.data.ordersByUser.map(order => thisOrderIds.push(order._id))
				await props.client
					.mutate({
						mutation: CONFIRM_ORDER,
						variables: {
							orderIds: thisOrderIds
						}
					})
					.then(res => {
						if (res) {
							setAlert(true)
						} else {
							openNotificationWithIcon(
								'error',
								'alert-confirm',
								t('common.Failed'),
								''
							)
						}
					})
					.catch(() => {
						openNotificationWithIcon('error', 'confirm', t('common.Failed'), '')
					})
			})
	}

	const time = new Date(Date.now()).getHours()
	const { t } = props
	const confirmButton =
		time > 11 && time < 15 ? (
			<Button
				onClick={handleConfirmOrder}
				id="confirm-order"
				style={{ display: 'block', textAlign: 'center', marginTop: 20 }}
				type="submit"
			>
				{t('common.Confirm')}
			</Button>
		) : null
	return (
		<React.Fragment>
			{alert === true ? (
				<Alert
					message={t('common.ConfirmSuccess')}
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

export default withApollo(ConfirmButton)
