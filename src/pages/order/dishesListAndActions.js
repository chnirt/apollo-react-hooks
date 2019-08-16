import React, { useState, useEffect } from 'react'
import { Row, Button, List } from 'antd'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'
import ConfirmButton from './comfirmButton'
import NoteButton from './noteButton'

function DishesListAndActions(props) {
	const [ordersCountedByUser, setOrdersCountedByUser] = useState({})
	const [loading, setLoading] = useState(false)
	const {
		t,
		getOrdersByUser,
		getOrdersByMenu,
		ordersByMenuCreated,
		menuId,
		dishes,
		orderDish,
		isPublished,
		isLocked
	} = props

	const { ordersByUser } = getOrdersByUser
	const { ordersCountByMenu } = getOrdersByMenu

	async function handleOrdersCountByUser() {
		if (ordersByUser) {
			const obj = {}
			// eslint-disable-next-line no-return-assign
			await dishes.map(dish => (obj[dish._id] = 0))
			// eslint-disable-next-line no-return-assign
			ordersByUser.map(order => (obj[order.dishId] = order.count))
			await setOrdersCountedByUser(obj)
		}
	}

	useEffect(() => {
		handleOrdersCountByUser()
	}, [ordersByUser])

	async function createOrder(item, quantity) {
		setLoading(true)
		orderDish({
			mutation: ORDER_DISH,
			variables: {
				input: {
					menuId,
					dishId: item._id,
					count: quantity
				}
			},
			refetchQueries: [
				{
					query: ORDERS_BY_USER,
					variables: {
						menuId
					}
				},
				{
					query: ORDERS_BY_MENU,
					variables: {
						menuId
					}
				}
			]
		})
			.then(async res => {
				if (res.data.orderDish) {
					openNotificationWithIcon(
						'success',
						'alert-order',
						t('src.pages.common.success'),
						null
					)
					await setOrdersCountedByUser({
						...ordersCountedByUser,
						[item._id]: quantity
					})
				} else {
					openNotificationWithIcon(
						'error',
						'alert-order',
						t('src.pages.common.failed'),
						null
					)
				}
				setLoading(false)
			})
			.catch(() => {
				openNotificationWithIcon(
					'error',
					'order',
					t('src.pages.common.failed'),
					null
				)
			})
	}

	async function handleMinus(item) {
		if (!!ordersCountedByUser[item._id] && ordersCountedByUser[item._id] > 0) {
			await createOrder(item, ordersCountedByUser[item._id] - 1)
		} else {
			await createOrder(item, 0)
		}
	}

	async function handlePlus(item) {
		if (
			ordersCountedByUser[item._id] !== undefined &&
			ordersCountedByUser[item._id] < item.count
		) {
			await createOrder(item, ordersCountedByUser[item._id] + 1)
		} else {
			await createOrder(item, 1)
		}
	}

	return (
		<React.Fragment>
			{isPublished ? (
				<>
					<List
						size="large"
						dataSource={dishes}
						renderItem={item => {
							const total =
								ordersByMenuCreated.ordersByMenuCreated &&
								ordersByMenuCreated.ordersByMenuCreated.findIndex(
									order => order._id === item._id
								) !== -1
									? ordersByMenuCreated.ordersByMenuCreated[
											ordersByMenuCreated.ordersByMenuCreated.findIndex(
												order => order._id === item._id
											)
									  ].count
									: ordersCountByMenu &&
									  ordersCountByMenu.findIndex(
											order => order._id === item._id
									  ) !== -1
									? ordersCountByMenu[
											ordersCountByMenu.findIndex(
												order => order._id === item._id
											)
									  ].count
									: 0
							return (
								<List.Item
									style={{
										backgroundColor: '#fff',
										marginBottom: 20,
										padding: 20,
										borderRadius: 5
									}}
									key={item._id}
									actions={[
										<Button
											icon="minus"
											shape="circle"
											loading={loading}
											id={`minus-order-${item._id}`}
											className="minus-order"
											disabled={ordersCountedByUser[item._id] <= 0 || isLocked}
											onClick={() => handleMinus(item)}
										/>,
										<Button
											icon="plus"
											shape="circle"
											loading={loading}
											id={`plus-order-${item._id}`}
											className="plus-order"
											disabled={total >= item.count || isLocked}
											onClick={() => handlePlus(item)}
										/>
									]}
									extra={
										<NoteButton
											t={t}
											dishId={item._id}
											menuId={menuId}
											quantity={ordersCountedByUser[item._id]}
											isLocked={ordersCountedByUser[item._id] <= 0 || isLocked}
											loading={loading}
										/>
									}
								>
									<List.Item.Meta
										title={item.name}
										description={`${total}/${item.count}`}
									/>
									<div>
										{(ordersCountedByUser && ordersCountedByUser[item._id]) || 0}
									</div>
								</List.Item>
							)
						}}
					/>
					<ConfirmButton t={t} />
				</>
			) : (
				<Row
					type="flex"
					justify="center"
					align="middle"
					style={{
						color: '#fff'
					}}
				>
					<div>{t('src.pages.order.systemHasLocked')}</div>
				</Row>
			)}
		</React.Fragment>
	)
}

const ORDERS_BY_MENU = gql`
	query($menuId: String!) {
		ordersCountByMenu(menuId: $menuId) {
			menuId
			_id
			count
		}
	}
`

const ORDERS_BY_USER = gql`
	query ordersByUser($menuId: String!) {
		ordersByUser(menuId: $menuId) {
			menuId
			dishId
			count
		}
	}
`

const ORDER_DISH = gql`
	mutation orderDish($input: CreateOrderInput!) {
		orderDish(input: $input)
	}
`

const ORDERS_BY_MENU_SUBSCRIPTION = gql`
	subscription {
		ordersByMenuCreated {
			menuId
			count
			_id
		}
	}
`

export default compose(
	graphql(ORDER_DISH, {
		name: 'orderDish'
	}),
	graphql(ORDERS_BY_MENU, {
		name: 'getOrdersByMenu',
		skip: props => !props.menuId,
		options: props => ({
			variables: {
				menuId: props.menuId
			}
		})
	}),
	graphql(ORDERS_BY_USER, {
		name: 'getOrdersByUser',
		skip: props => !props.menuId,
		options: props => ({
			variables: {
				menuId: props.menuId
			}
		})
	}),
	graphql(ORDERS_BY_MENU_SUBSCRIPTION, {
		name: 'ordersByMenuCreated'
	})
)(DishesListAndActions)
