import React, { useState, useEffect } from 'react'
import { Row, Button, List } from 'antd'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'
import ConfirmButton from './comfirmButton'
import NoteButton from './noteButton'

function DishesListAndActions(props) {
	const [ordersCountedByUser, setOrdersCountedByUser] = useState({})
	const {
		t,
		ordersByMenuC,
		ordersCountByUserC,
		ordersByMenuCreated,
		menuId,
		dishes,
		orderDish,
		isPublished,
		isLocked,
		ordersByMenu
	} = props

	async function handleOrdersCountByUser() {
		const obj = {}
		// eslint-disable-next-line no-return-assign
		await dishes.map(dish => (obj[dish._id] = 0))
		// eslint-disable-next-line no-return-assign
		ordersCountByUserC.map(order => (obj[order.dishId] = order.count))
		await setOrdersCountedByUser(obj)
	}

	useEffect(() => {
		handleOrdersCountByUser()
	}, [])

	async function createOrder(item, quantity) {
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
					openNotificationWithIcon('success', 'alert-order', t('Success'), null)
					await setOrdersCountedByUser({
						...ordersCountedByUser,
						[item._id]: quantity
					})
				} else {
					openNotificationWithIcon('error', 'alert-order', t('Failed'), null)
				}
			})
			.catch(() => {
				openNotificationWithIcon('error', 'order', t('Failed'), null)
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
			{isPublished === true ? (
				<>
					<List
						size="large"
						dataSource={dishes}
						renderItem={item => (
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
										id={`minus-order-${item._id}`}
										className="minus-order"
										disabled={
											ordersCountedByUser[item._id] === 0 ||
											ordersCountedByUser[item._id] === undefined ||
											isLocked
										}
										onClick={() => handleMinus(item)}
									/>,
									<Button
										icon="plus"
										shape="circle"
										id={`plus-order-${item._id}`}
										className="plus-order"
										disabled={
											ordersCountedByUser[item._id] === item.count || isLocked
										}
										onClick={() => handlePlus(item)}
									/>
								]}
								extra={
									<NoteButton
										t={t}
										dishId={item._id}
										menuId={menuId}
										quantity={ordersCountedByUser[item._id]}
										isLocked={isLocked}
										ordersCountedByUser={ordersCountedByUser}
										ordersByMenu={ordersByMenu.ordersByMenu}
									/>
								}
							>
								<List.Item.Meta
									title={item.name}
									description={`${
										// eslint-disable-next-line no-nested-ternary
										ordersByMenuCreated.ordersByMenuCreated &&
										ordersByMenuCreated.ordersByMenuCreated.findIndex(
											order => order.dishId === item._id
										) !== -1
											? ordersByMenuCreated.ordersByMenuCreated[
													ordersByMenuCreated.ordersByMenuCreated.findIndex(
														order => order.dishId === item._id
													)
											  ].count
											: ordersByMenuC &&
											  ordersByMenuC.findIndex(
													order => order.dishId === item._id
											  ) !== -1
											? ordersByMenuC[
													ordersByMenuC.findIndex(
														order => order.dishId === item._id
													)
											  ].count
											: 0
									}/${item.count}`}
								/>
								<div>
									{(ordersCountedByUser && ordersCountedByUser[item._id]) || 0}
								</div>
							</List.Item>
						)}
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
					<div>{t('System has locked')}</div>
				</Row>
			)}
		</React.Fragment>
	)
}

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
			dishId
		}
	}
`

const ORDERS_BY_MENU = gql`
	query ordersByMenu($menuId: String!) {
		ordersByMenu(menuId: $menuId) {
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

const ORDERS_BY_USER = gql`
	query ordersByUser($menuId: String!) {
		ordersByUser(menuId: $menuId) {
			menuId
			dishId
			count
		}
	}
`

export default compose(
	graphql(ORDER_DISH, {
		name: 'orderDish'
	}),
	graphql(ORDERS_BY_USER, {
		name: 'ordersCountByUser',
		options: props => ({
			variables: {
				menuId: props.menuId
			}
		})
	}),
	graphql(ORDERS_BY_MENU, {
		name: 'ordersByMenu',
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
