import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Divider, List, Alert } from 'antd'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'

const Order = props => {
	const [dishes, setDishes] = useState()
	const [menuId, setMenuId] = useState()
	// const [setOrdersByMenu] = useState()
	const [isPublish, setIsPublish] = useState()
	const [isLocked, setIsLocked] = useState()
	const [alert, setAlert] = useState(false)
	const [ordersCountByUser, setOrdersCountByUser] = useState({})

	useEffect(() => {
		props.client
			.query({
				query: MENU_BY_SELECTED_SITE,
				variables: {
					siteId: localStorage.getItem('currentsite')
				}
				// refetchQueries: [{}]
			})
			.then(async res => {
				await props.client
					.query({
						query: ORDERS_COUNT_BY_USER,
						variables: {
							menuId: res.data.menuPublishBySite._id
						}
						// refetchQueries: [{}]
					})
					.then(async result => {
						const userOrder = result.data.ordersCountByUser.map(order => ({
							[order.dishId]: order.count
						}))
						const allMenu = res.data.menuPublishBySite.dishes.map(order => ({
							[order._id]: 0
						}))

						const reducedArray = allMenu.reduce((accumulator, item) => {
							const key = Object.keys(item).join()
							const indx = userOrder.findIndex(
								ele => Object.keys(ele).join() === key
							)
							if (indx !== -1) {
								accumulator.push(userOrder[indx])
							} else accumulator.push(item)
							return accumulator
						}, [])
						await setOrdersCountByUser(reducedArray)
					})
					.catch(error => {
						console.log(error)
					})
			})
			.catch(error => {
				console.log(error)
			})
		// eslint-disable-next-line no-use-before-define
		handleOrdersCountByUser()
		// eslint-disable-next-line no-use-before-define
		handleDefaultDishes()
		// eslint-disable-next-line no-use-before-define
		handleOrdersByMenu()
	}, [])

	async function handleDefaultDishes() {
		await props.client
			.query({
				query: MENU_BY_SELECTED_SITE,
				variables: {
					siteId: localStorage.getItem('currentsite')
				}
			})
			.then(async res => {
				await setIsPublish(res.data.menuPublishBySite.isPublished)
				await setIsLocked(res.data.menuPublishBySite.isLocked)
				if (
					res.data.menuPublishBySite.isPublished === true &&
					res.data.menuPublishBySite.isActive === true
				) {
					await setMenuId(res.data.menuPublishBySite._id)
					await setDishes([...res.data.menuPublishBySite.dishes])
				}
			})
			.catch(error => {
				console.log(error)
			})
	}

	async function createOrder(item, quantity) {
		await props.client
			.mutate({
				mutation: ORDER_DISH,
				variables: {
					input: {
						menuId,
						dishId: item._id,
						count: quantity
					}
				}
			})
			.then(res => {
				// eslint-disable-next-line no-unused-expressions
				res.data.orderDish
					? console.log('Đặt thành công')
					: console.log('something went wrong')
			})
			.catch(error => {
				console.dir(error)
			})
	}

	async function selectDishHandler(item) {
		console.log(ordersCountByUser[item._id])
		const quantity = Number(ordersCountByUser[item._id])
		// await dishes.map(dish => {
		// 	return dish.dishId === item._id &&
		// 		ordersCountByUser[item._id] <= item.count
		// 		? (quantity = Number(ordersCountByUser[item._id]) + 1)
		// 		: (quantity = Number(ordersCountByUser[item._id]))
		// })
		await setOrdersCountByUser(quantity)
		// console.log(ordersCountByUser)
		await createOrder(item, quantity)
		// const theDish = [...dishes]
		// // eslint-disable-next-line no-return-assign
		// 		? (theDish[index] = {
		// 				...theDish[index],
		// 				orderNumber: item.orderNumber + 1
		// 		  })
		// 		: (theDish[index] = { ...theDish[index], orderNumber: item.orderNumber })
		// await setDishes(theDish)
		// console.log(ordersCountByUser)
		// console.log(item)
	}

	async function unselectDishHandler(item) {
		console.log(ordersCountByUser[item._id])
		const quantity = Number(ordersCountByUser[item._id])
		// await dishes.map(dish => {
		// 	(dish.dishId === item._id && ordersCountByUser[item._id] >= 0)
		// 		? (quantity = Number(ordersCountByUser[item._id]) - 1)
		// 		: (quantity = Number(ordersCountByUser[item._id]))
		// })
		await setOrdersCountByUser(quantity)
		// console.log(ordersCountByUser)
		await createOrder(item, quantity)
		// await setDishes(theDish)
		// const theDish = [...dishes]
		// // eslint-disable-next-line no-return-assign
		// await dishes.map(dish =>
		// 	dish._id === item._id && dish.orderNumber > item.count
		// 		? (theDish[index] = {
		// 				...theDish[index],
		// 				orderNumber: item.orderNumber - 1
		// 		  })
		// 		: (theDish[index] = { ...theDish[index], orderNumber: item.orderNumber })
		// )
		// console.log(ordersCountByUser)
		// console.log(item)
	}

	async function handleMinus(item) {
		// const index = dishes.map(dish => dish._id).indexOf(item._id)
		await unselectDishHandler(item)
		console.log(item)
	}

	async function handlePlus(item) {
		// const index = dishes.map(dish => dish._id).indexOf(item._id)
		await selectDishHandler(item)
		console.log(item)
	}

	async function handleConfirmOrder() {
		await props.client
			.query({
				query: ORDERS_BY_USER,
				variables: {
					menuId
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
						// eslint-disable-next-line no-unused-expressions
						res ? setAlert(true) : console.log('something went wrong')
					})
					.catch(error => {
						console.dir(error)
					})
			})
	}

	async function handleOrdersByMenu() {
		// props.client
		// 	.query({
		// 		query: MENU_BY_SELECTED_SITE,
		// 		variables: {
		// 			siteId: localStorage.getItem('currentsite')
		// 		}
		// 	})
		// 	.then(async res => {
		// 		await props.client
		// 			.query({
		// 				query: ORDERS_BY_MENU,
		// 				variables: {
		// 					menuId: res.data.menuPublishBySite._id
		// 				}
		// 			})
		// 			.then(async result => {
		// 				const obj = {}
		// 				await result.data.ordersByMenu.map(
		// 					// eslint-disable-next-line no-return-assign
		// 					order => (obj[order.dishId] = order.count)
		// 				)
		// 				await setOrdersByMenu(obj)
		// 			})
		// 			.catch(error => {
		// 				console.log(error)
		// 			})
		// 	})
		// 	.catch(error => {
		// 		console.log(error)
		// 	})
	}

	async function handleOrdersCountByUser() {
		props.client
			.query({
				query: MENU_BY_SELECTED_SITE,
				variables: {
					siteId: localStorage.getItem('currentsite')
				}
			})
			.then(async res => {
				await props.client
					.query({
						query: ORDERS_COUNT_BY_USER,
						variables: {
							menuId: res.data.menuPublishBySite._id
						}
					})
					.then(async result => {
						const obj = {}
						await result.data.ordersCountByUser.map(
							// eslint-disable-next-line no-return-assign
							order => (obj[order.dishId] = order.count)
						)
						await setOrdersCountByUser(obj)
					})
					.catch(error => {
						console.log(error)
					})
			})
			.catch(error => {
				console.log(error)
			})
	}

	const time = new Date(Date.now()).getHours()
	const confirmButton =
		time >= 12 && time < 14 ? (
			<Button
				onClick={handleConfirmOrder}
				id="confirm-order"
				style={{ display: 'block', textAlign: 'center' }}
			>
				Xác nhận
			</Button>
		) : null

	console.log(ordersCountByUser)
	return (
		<React.Fragment>
			<div style={{ backgroundColor: '#eee' }}>
				<Button
					shape="circle"
					icon="left"
					onClick={() => props.history.push('/🥢')}
				/>
				<Divider />
				<Row>
					<Col span={22} offset={1}>
						{isPublish === true ? (
							<>
								{alert === true ? (
									<Alert
										message="Xác nhận thành công"
										type="success"
										showIcon
										closable
									/>
								) : null}
								<List
									dataSource={dishes}
									renderItem={item => (
										<List.Item
											key={item._id}
											actions={[
												<Button
													id={`minus-order-${item._id}`}
													className="minus-order"
													disabled={isLocked}
													onClick={() => handleMinus(item)}
												>
													-
												</Button>,
												<Button
													id={`plus-order-${item._id}`}
													className="plus-order"
													disabled={isLocked}
													onClick={() => handlePlus(item)}
												>
													+
												</Button>
											]}
											// extra={
											// 	<Button>
											// 		Note
											// 	</Button>
											// }
										>
											<List.Item.Meta
												title={item.name}
												// description={
												// 	`${item.orderNumber}` === 'undefined'
												// 		? `${0}/${item.count}`
												// 		: `${item.orderNumber}/${item.count}`
												// }
												description={`${0}/${item.count}`}
											/>
											{/* <div>{item.orderNumber}</div> */}
											{/* {console.log(ordersCountByUser[item._id])} */}
											<div>{ordersCountByUser[item._id] || 0}</div>
											{/* <div>{stateOrder[item._id]}</div> */}
										</List.Item>
									)}
								/>
								<Row type="flex" justify="center" align="bottom">
									{confirmButton}
								</Row>
							</>
						) : (
							<Row type="flex" justify="center" align="middle">
								<div>Hệ thống đã khóa</div>
							</Row>
						)}
					</Col>
				</Row>
			</div>
		</React.Fragment>
	)
}

const MENU_BY_SELECTED_SITE = gql`
	query menuPublishBySite($siteId: String!) {
		menuPublishBySite(siteId: $siteId) {
			_id
			name
			siteId
			dishes {
				_id
				name
				count
			}
			isPublished
			isActive
			isLocked
			createAt
			updateAt
		}
	}
`

const ORDER_DISH = gql`
	mutation orderDish($input: CreateOrderInput!) {
		orderDish(input: $input)
	}
`

const CONFIRM_ORDER = gql`
	mutation confirmOrder($orderIds: [String]) {
		confirmOrder(orderIds: $orderIds)
	}
`

// const ORDERS_BY_MENU = gql`
// 	query ordersByMenu($menuId: String!) {
// 		ordersByMenu(menuId: $menuId) {
// 			_id
// 			userId
// 			menuId
// 			dishId
// 			note
// 			count
// 			isConfirmed
// 			createdAt
// 			updatedAt
// 		}
// 	}
// `

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

const ORDERS_COUNT_BY_USER = gql`
	query ordersCountByUser($menuId: String!) {
		ordersCountByUser(menuId: $menuId) {
			menuId
			dishId
			count
		}
	}
`

export default withApollo(Order)
