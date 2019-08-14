import React from 'react'
import { Button } from 'antd'
import { graphql, compose } from 'react-apollo'
import {
	GET_MENU_ORDERS,
	ORDER_DISH,
	ORDER_SUBSCRIPTION
} from '../query/queryOrder'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'

function OrderDishList(props) {
	const { disabled, getMenu, siteId, orderDish, orderUpdated } = props

	console.log(siteId)

	console.log(getMenu)

	const dishes = getMenu && getMenu.menuOrder ? getMenu.menuOrder.dishes : []

	console.log(dishes)

	if (siteId && orderUpdated.isUpdated) {
		// có update order thì refetch data
		getMenu
			.refetch({
				siteId
			})
			.then(() => {})
			.catch(err => {
				const errors = err.graphQLErrors.map(error => error.message)
				openNotificationWithIcon('error', 'failed', 'Failed', errors[0])
			})
	}

	function onClickUpdate(dishId, action) {
		const dish = dishes.find(_dish => _dish.dishId === dishId)
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

		orderDish({
			mutation: ORDER_DISH,
			variables: {
				input: {
					menuId: getMenu.menuOrder.menuId,
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
	}

	return (
		<div className="list-dishes-order">
			<React.Fragment>
				{dishes.map(dish => {
					let styleButtonUp = 'red'
					let styleButtonDown = 'red'

					if (dish.orderQuantityNow >= dish.orderQuantityMax) {
						styleButtonUp = '#ffbcbc'
					}

					if (dish.orderQuantityNow === 0 || dish.MyOrderQuantity === 0) {
						styleButtonDown = '#ffbcbc'
					}

					if (disabled) {
						styleButtonUp = 'rgb(201, 201, 201)'
						styleButtonDown = 'rgb(201, 201, 201)'
					}

					return (
						<div
							key={dish.dishId}
							className="list-dishes-order-item"
							role="presentation"
							style={{
								color: disabled ? 'rgb(201, 201, 201)' : '#2c2c2c'
							}}
						>
							{dish.name} x {dish.MyOrderQuantity}
							<div className="list-dishes-order-item-Groupsbutton">
								<p>
									{dish.orderQuantityNow}/{dish.orderQuantityMax}
								</p>
								<Button
									disabled={disabled}
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
									disabled={disabled}
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
		name: 'orderDish'
	}),

	graphql(ORDER_SUBSCRIPTION, {
		name: 'orderUpdated',
		skip: props => !props.siteId
	})
)(OrderDishList)
