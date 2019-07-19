import React, { useState, useLayoutEffect } from 'react'
import { Row, Col, Button, Divider, List, Alert } from 'antd'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'

const Order = props => {
	const [dishes, setDishes] = useState()
	const [menuId, setMenuId] = useState()
	const [setOrderNumber] = useState()
	// const [orderNumbers, setOrderNumbers] = useState()
	const [setOrdersByMenu] = useState()
	const [isPublish, setIsPublish] = useState()
	const [isLocked, setIsLocked] = useState()
	const [alert, setAlert] = useState(false)
	const [ordersCountByUser, setOrdersCountByUser] = useState({})

	useLayoutEffect(() => {
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
						if (result.data.ordersByMenu) {
							await setOrdersCountByUser(
								result.data.ordersCountByUser.map(order => ({
									[order.dishId]: order.count
								}))
							)
							localStorage.setItem('orderNumbers', [
								...result.data.ordersCountByUser.map(order => order.count)
							])
						}
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
		console.log(ordersCountByUser)
		// console.log(orderNumbers)
		// await getOrdersByMenu()
		// const orderNumbers = await props.ordersByMenu.ordersByMenu.map(order => order.count)
		const orderNumbers = localStorage.getItem('orderNumbers')
			? localStorage.getItem('orderNumbers').split(',')
			: null
		// const newOrderNumbers = (orderNumbers) ? orderNumbers : null
		// await setOrderNumbers(ordersCountByUser)
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
					await setOrderNumber(
						[...res.data.menuPublishBySite.dishes].map(
							// eslint-disable-next-line no-return-assign
							(dish, index) => (dish.orderNumber = orderNumbers[index])
						)
					)
					await setDishes([...res.data.menuPublishBySite.dishes])
				}
			})
			.catch(error => {
				console.log(error)
			})
	}

	async function createOrder(item) {
		console.log(item)
		await props.client
			.mutate({
				mutation: ORDER_DISH,
				variables: {
					input: {
						menuId,
						dishId: item._id,
						count: item.orderNumber
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

	async function selectDishHandler(index, item) {
		const theDish = [...dishes]
		// eslint-disable-next-line no-return-assign
		await dishes.map(dish =>
			dish._id === item._id && dish.orderNumber < item.count
				? (theDish[index] = {
						...theDish[index],
						orderNumber: item.orderNumber + 1
				  })
				: (theDish[index] = { ...theDish[index], orderNumber: item.orderNumber })
		)
		await setDishes(theDish)
		console.log(dishes)
		await createOrder(item)
	}

	async function unselectDishHandler(index, item) {
		const theDish = [...dishes]
		// eslint-disable-next-line no-return-assign
		await dishes.map(dish =>
			dish._id === item._id && dish.orderNumber > item.count
				? (theDish[index] = {
						...theDish[index],
						orderNumber: item.orderNumber - 1
				  })
				: (theDish[index] = { ...theDish[index], orderNumber: item.orderNumber })
		)
		await setDishes(theDish)
		console.log(dishes)
		await createOrder(item)
	}

	async function handleMinus(item) {
		const index = dishes.map(dish => dish._id).indexOf(item._id)
		await unselectDishHandler(index, item)
		console.log(dishes)
	}

	async function handlePlus(item) {
		const index = dishes.map(dish => dish._id).indexOf(item._id)
		await selectDishHandler(index, item)
		console.log(dishes)
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
						query: ORDERS_BY_MENU,
						variables: {
							menuId: res.data.menuPublishBySite._id
						}
					})
					.then(async result => {
						const obj = {}
						await result.data.ordersByMenu.map(
							// eslint-disable-next-line no-return-assign
							order => (obj[order.dishId] = order.count)
						)
						console.log(obj)
						await setOrdersByMenu(obj)
					})
					.catch(error => {
						console.log(error)
					})
			})
			.catch(error => {
				console.log(error)
			})
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
						console.log(obj)
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

	return (
		<React.Fragment>
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
										<div>{item.orderNumber}</div>
										{/* <div>{ordersCountByUser[item._id]}</div> */}
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
