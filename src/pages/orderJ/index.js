import React, { useState } from 'react'
import { Row, Button, Typography, List, Col } from 'antd'
import { withTranslation } from 'react-i18next'
import { graphql, compose } from 'react-apollo'
import {
	GET_MENU_ORDERS,
	ORDER_DISH,
	GET_DATA_ORDER_SUBSCRIPTION,
	MENU_UPDATED_SUBSCRIPTION
	// ORDER_SUBSCRIPTION
} from './query/queryOrder'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

function OrderJ(props) {
	const { me, t } = props
	const userId = me._id || ''

	const { getMenu, orderJDish, isUpdatedOrder, isUpdatedMenu } = props

	const dishes = getMenu && getMenu.menuOrderJ ? getMenu.menuOrderJ.dishes : []
	const isLocked =
		getMenu && getMenu.menuOrderJ ? getMenu.menuOrderJ.isLocked : false

	if (isUpdatedOrder && isUpdatedOrder.isUpdatedOrder) {
		// nhận được dâta pubsub
		if (getMenu && getMenu.menuOrderJ) {
			if (isUpdatedOrder.isUpdatedOrder.menuId === getMenu.menuOrderJ.menuId) {
				// data nhận được trên cùng menu này
				const dish = dishes.find(
					obj => obj.dishId === isUpdatedOrder.isUpdatedOrder.dishId
				)

				if (userId === isUpdatedOrder.isUpdatedOrder.impactUserId) {
					// nếu user là người tác động nên sự kiện này thì cập nhật lại số lượng order của user
					dish.MyOrderQuantity =
						isUpdatedOrder.isUpdatedOrder.OrderQuantityOfImpactUser
				}

				dish.orderQuantityNow = isUpdatedOrder.isUpdatedOrder.orderQuantityNow
				// Cập nhật tổng order
			}
		}
	}

	if (isUpdatedMenu && isUpdatedMenu.isUpdatedMenu) {
		getMenu.refetch()
	}

	const [isLoading, setIsLoading] = useState(false)

	function onClickUpdate(dishId, action) {
		if (isLoading) {
			return
		}
		const dishRef = dishes.find(_dish => _dish.dishId === dishId)
		const dish = { ...dishRef }

		if (action === 'up') {
			if (dish.orderQuantityNow === dish.orderQuantityMax) {
				openNotificationWithIcon(
					'error',
					'failed',
					'Failed',
					`Món này chỉ có tối đa ${dish.orderQuantityMax} phần!`
				)
				return
			}
			dish.MyOrderQuantity += 1
		} else {
			if (dish.MyOrderQuantity === 0) {
				return
			}
			dish.MyOrderQuantity -= 1
		}

		setIsLoading(true)
		orderJDish({
			mutation: ORDER_DISH,
			variables: {
				input: {
					menuId: getMenu.menuOrderJ.menuId,
					dishId,
					count: dish.MyOrderQuantity
				}
			}
		})
			.then(() => {})
			.catch(err => {
				const errors = err.graphQLErrors.map(error => error.message)
				openNotificationWithIcon('error', 'failed', 'Failed', errors[0])
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	return (
		<React.Fragment>
			<Row style={{ overflow: 'hidden', marginTop: 10 }}>
				<Col span={22} offset={1}>
					<Typography.Title level={3} style={{ color: '#fff' }}>
						{t('dashBoard.Order')}
					</Typography.Title>

					<List
						size="large"
						dataSource={dishes}
						renderItem={dish => (
							<List.Item
								style={{
									backgroundColor: '#fff',
									marginBottom: 20,
									padding: 20,
									borderRadius: 5
								}}
								key={dish.dishId}
								actions={[
									<Button
										icon="minus"
										shape="circle"
										id={`minus-order-${dish.dishId}`}
										className="minus-order"
										disabled={
											dish.orderQuantityNow === 0 ||
											dish.MyOrderQuantity === 0 ||
											isLocked
										}
										onClick={e => {
											e.stopPropagation()
											onClickUpdate(dish.dishId, 'down')
										}}
									/>,
									<Button
										icon="plus"
										shape="circle"
										id={`plus-order-${dish.dishId}`}
										className="plus-order"
										disabled={
											dish.orderQuantityNow >= dish.orderQuantityMax || isLocked
										}
										onClick={e => {
											e.stopPropagation()
											onClickUpdate(dish.dishId, 'up')
										}}
									/>
								]}
								// extra={<Button />}
							>
								<List.Item.Meta
									title={dish.name}
									description={`${dish.orderQuantityNow}/${dish.orderQuantityMax}`}
								/>
								<div>{dish.MyOrderQuantity}</div>
							</List.Item>
						)}
					/>
				</Col>
			</Row>
		</React.Fragment>
	)
}

export default compose(
	graphql(GET_MENU_ORDERS, {
		name: 'getMenu',
		skip: props => !props.currentsite,
		options: props => ({
			fetchPolicy: 'no-cache',
			variables: {
				siteId: props.currentsite
			}
		})
	}),

	graphql(ORDER_DISH, {
		name: 'orderJDish'
	}),

	graphql(MENU_UPDATED_SUBSCRIPTION, {
		name: 'isUpdatedMenu',
		skip: props => !props.currentsite
	}),

	graphql(GET_DATA_ORDER_SUBSCRIPTION, {
		name: 'isUpdatedOrder',
		skip: props => !props.currentsite
	})
)(withTranslation('translations')(OrderJ))
