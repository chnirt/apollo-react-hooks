/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Button, List, Form } from 'antd'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import NoteForm from './noteForm'
import ConfirmButton from './comfirmButton'

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

const UPDATE_ORDER = gql`
	mutation updateOrder($id: String!, $input: UpdateOrderInput!) {
		updateOrder(id: $id, input: $input)
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

const SUBSCRIPTION = gql`
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

const CURRENT_ORDER = gql`
	query currentOrder($menuId: String!, $dishId: String!) {
		currentOrder(menuId: $menuId, dishId: $dishId) {
			_id
			userId
			menuId
			dishId
			note
			count
			isConfirmed
		}
	}
`

const ListDishesAndActions = props => {
	const [dishes, setDishes] = useState()
	const [menuId, setMenuId] = useState()
	const [orderedNumber, setOrderedNumber] = useState({})
	const [isPublish, setIsPublish] = useState()
	const [isLocked, setIsLocked] = useState()
	const [ordersCountByUser, setOrdersCountByUser] = useState({})
	const [modalVisible, setModalVisible] = useState(false)
	const [selectedItem, setSelectedItem] = useState()
	const [selectedOrder, setSelectedOrder] = useState()
	// eslint-disable-next-line react/destructuring-assignment
	let formRef = useRef()

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

	async function handleOrdersByMenu() {
		await props.client
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
						// eslint-disable-next-line no-return-assign
						await result.data.ordersByMenu.map(order =>
							obj[order.dishId]
								? // eslint-disable-next-line operator-assignment
								  (obj[order.dishId] = obj[order.dishId] + order.count)
								: (obj[order.dishId] = order.count)
						)
						await setOrderedNumber(obj)
					})
					.catch(error => {
						console.log(error)
					})
			})
			.catch(error => {
				console.log(error)
			})
	}

	async function handleOrderedNumber() {
		await props.client
			.subscribe({
				query: SUBSCRIPTION
			})
			.subscribe({
				async next(data) {
					const obj = {}
					// eslint-disable-next-line no-return-assign
					await data.data.ordersByMenuCreated.map(order =>
						obj[order.dishId]
							? // eslint-disable-next-line operator-assignment
							  (obj[order.dishId] = obj[order.dishId] + order.count)
							: (obj[order.dishId] = order.count)
					)
					await setOrderedNumber(obj)
				},
				error(err) {
					console.error('err', err)
				}
			})
	}

	async function handleOrdersCountByUser() {
		await props.client
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
						await res.data.menuPublishBySite.dishes.map(
							// eslint-disable-next-line no-return-assign
							dish => (obj[dish._id] = 0)
						)
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

	async function getOrder(item) {
		await props.client
			.query({
				query: CURRENT_ORDER,
				variables: {
					menuId,
					dishId: item._id
				}
			})
			.then(async res => {
				await setSelectedOrder(res.data.currentOrder)
			})
			.catch(error => {
				console.dir(error)
			})
	}

	useEffect(() => {
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
		handleOrderedNumber()
		handleDefaultDishes()
		// eslint-disable-next-line no-cond-assign
		handleOrdersByMenu()
		handleOrdersCountByUser()
	}, [])

	async function showModal(item) {
		await setSelectedItem(item)
		await getOrder(item)
		await setModalVisible(true)
	}

	function handleCancel() {
		setModalVisible(false)
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
				},
				refetchQueries: [
					{
						query: ORDERS_COUNT_BY_USER,
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
				await setSelectedOrder(res.data.orderDish)
				if (res.data.orderDish) {
					console.log('Đặt thành công')
					await handleOrderedNumber()
					await setOrdersCountByUser({
						...ordersCountByUser,
						[item._id]: quantity
					})
				} else {
					console.log('something went wrong')
				}
			})
			.catch(error => {
				console.dir(error)
			})
	}

	async function handleNote() {
		await formRef.validateFields(async (err, values) => {
			if (err) {
				return
			}
			await props.client
				.mutate({
					mutation: UPDATE_ORDER,
					variables: {
						id: selectedOrder._id,
						input: {
							menuId,
							dishId: selectedItem._id,
							note: values.note,
							count: ordersCountByUser[selectedItem._id]
						}
					},
					refetchQueries: [
						{
							query: CURRENT_ORDER,
							variables: {
								menuId,
								dishId: selectedItem._id
							}
						}
					]
				})
				.then(res => {
					if (res.data.updateOrder) {
						console.log('Note thành công')
					} else {
						console.log('something went wrong')
					}
				})
				.catch(error => {
					console.dir(error)
				})
			formRef.resetFields()
			setModalVisible(false)
		})
	}

	async function handleMinus(item) {
		if (!!ordersCountByUser[item._id] && ordersCountByUser[item._id] > 0) {
			await createOrder(item, ordersCountByUser[item._id] - 1)
		} else {
			await createOrder(item, 0)
		}
	}

	async function handlePlus(item) {
		if (
			ordersCountByUser[item._id] !== undefined &&
			ordersCountByUser[item._id] < item.count
		) {
			await createOrder(item, ordersCountByUser[item._id] + 1)
		} else {
			await createOrder(item, 1)
		}
	}

	// eslint-disable-next-line
	function saveFormRef(formRef) {
		// eslint-disable-next-line no-self-assign
		formRef = formRef
	}

	const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(NoteForm)
	return (
		<React.Fragment>
			<Row>
				<Col span={22} offset={1}>
					{isPublish === true ? (
						<>
							<List
								size="large"
								dataSource={dishes}
								renderItem={item => (
									<List.Item
										style={{
											backgroundColor: '#fff',
											marginBottom: 20,
											padding: 20
										}}
										key={item._id}
										actions={[
											<Button
												icon="minus"
												shape="circle"
												id={`minus-order-${item._id}`}
												className="minus-order"
												disabled={
													ordersCountByUser[item._id] === 0 ||
													ordersCountByUser[item._id] === undefined ||
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
													ordersCountByUser[item._id] === item.count ||
													orderedNumber[item._id] >= item.count ||
													isLocked
												}
												onClick={() => handlePlus(item)}
											/>
										]}
										extra={
											<Button
												icon="form"
												shape="circle"
												type="primary"
												onClick={() => showModal(item)}
												id={`note-order-${item._id}`}
												disabled={ordersCountByUser[item._id] === 0 || isLocked}
											/>
										}
									>
										<List.Item.Meta
											title={item.name}
											description={`${(orderedNumber &&
												orderedNumber[item._id]) ||
												0}/${item.count}`}
										/>
										{/* chưa set reponsive CSS cho cái này nên để tạm ở description */}
										{/* <div style={{marginRight: 20}}>
											{`${(orderedNumber && orderedNumber[item._id]) || 0}/${item.count}`}
										</div> */}
										<div>
											{(ordersCountByUser && ordersCountByUser[item._id]) || 0}
										</div>
									</List.Item>
								)}
							/>
							<ConfirmButton menuId={menuId} />
						</>
					) : (
						<Row type="flex" justify="center" align="middle">
							<div>Hệ thống đã khóa</div>
						</Row>
					)}
				</Col>
			</Row>
			<CollectionCreateForm
				wrappedComponentRef={saveFormRef}
				visible={modalVisible}
				onCancel={handleCancel}
				onCreate={handleNote}
				// eslint-disable-next-line no-return-assign
				refForm={ref => (formRef = ref)}
				noted={(selectedOrder && selectedOrder.note) || null}
			/>
		</React.Fragment>
	)
}

export default withApollo(ListDishesAndActions)
