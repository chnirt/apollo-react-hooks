import React, { useState } from 'react'
import { Button } from 'antd'
import { graphql, compose } from 'react-apollo'
import {
	GET_MENU_ORDERS,
	ORDER_DISH,
	GET_DATA_ORDER_SUBSCRIPTION,
	MENU_UPDATED_SUBSCRIPTION
	// ORDER_SUBSCRIPTION
} from '../query/queryOrder'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'

function OrderDishList(props) {
	const { getMenu, orderJDish, isUpdatedOrder, userId, isUpdatedMenu } = props

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
		<div className="list-dishes-order">
			<React.Fragment>
				{dishes.map(dish => {
					let styleButtonUp = 'red'
					let styleButtonDown = 'red'
					let styleCountText = 'red'

					if (dish.orderQuantityNow >= dish.orderQuantityMax) {
						styleButtonUp = '#ffbcbc'
					}

					if (dish.orderQuantityNow === 0 || dish.MyOrderQuantity === 0) {
						styleButtonDown = '#ffbcbc'
					}

					if (isLocked) {
						styleButtonUp = 'rgb(201, 201, 201)'
						styleButtonDown = 'rgb(201, 201, 201)'
						styleCountText = 'rgb(201, 201, 201)'
					}

					return (
						<div
							key={dish.dishId}
							className="list-dishes-order-item"
							role="presentation"
							style={{
								color: isLocked ? 'rgb(201, 201, 201)' : '#2c2c2c'
							}}
						>
							{dish.name} x {dish.MyOrderQuantity}
							<div className="list-dishes-order-item-Groupsbutton">
								<p style={{ color: styleCountText }}>
									{dish.orderQuantityNow}/{dish.orderQuantityMax}
								</p>
								<Button
									disabled={isLocked || isLoading}
									style={{
										color: styleButtonDown
									}}
									className="order-minus-button"
									icon="minus"
									type="link"
									shape="circle"
									onClick={e => {
										e.stopPropagation()
										onClickUpdate(dish.dishId, 'down')
									}}
								/>
								<Button
									className="order-plus-button"
									disabled={isLocked || isLoading}
									icon="plus"
									type="link"
									shape="circle"
									style={{
										color: styleButtonUp
									}}
									onClick={e => {
										e.stopPropagation()
										onClickUpdate(dish.dishId, 'up')
									}}
								/>
							</div>
						</div>
					)
				})}
			</React.Fragment>
		</div>
	)
}

export default compose(
	graphql(GET_MENU_ORDERS, {
		name: 'getMenu',
		skip: props => !props.siteId,
		options: props => ({
			fetchPolicy: 'no-cache',
			variables: {
				siteId: props.siteId
			}
		})
	}),

	graphql(ORDER_DISH, {
		name: 'orderJDish'
	}),

	graphql(MENU_UPDATED_SUBSCRIPTION, {
		name: 'isUpdatedMenu',
		skip: props => !props.siteId
	}),

	graphql(GET_DATA_ORDER_SUBSCRIPTION, {
		name: 'isUpdatedOrder',
		skip: props => !props.siteId
	})
)(OrderDishList)
