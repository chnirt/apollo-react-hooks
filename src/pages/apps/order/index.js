/* eslint-disable no-return-assign */
/* eslint-disable no-shadow */
/* eslint-disable no-self-assign */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Button, List, Alert, Modal, Input, Form } from 'antd'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'

class NoteForm extends React.Component {
	constructor(props) {
		super(props)
		this.form = React.createRef()
	}

	componentDidMount() {
		// eslint-disable-next-line react/destructuring-assignment
		if (this.props.refForm) {
			// eslint-disable-next-line react/destructuring-assignment
			this.props.refForm(this.props.form)
		}
	}

	render() {
		const { visible, onCancel, onCreate, form } = this.props
		const { getFieldDecorator } = form
		return (
			<Modal
				visible={visible}
				onCancel={onCancel}
				title="Thêm ghi chú"
				footer={[
					<Button
						key="cancel"
						type="danger"
						onClick={onCancel}
						name="cancelNote"
					>
						Đóng
					</Button>,
					<Button key="save" type="primary" onClick={onCreate} name="addNote">
						Thêm
					</Button>
				]}
			>
				<Form colon={false} ref={this.form}>
					<Form.Item className="collection-create-form_last-form-item">
						{getFieldDecorator('note', {
							rules: [
								{ required: false, message: 'Hãy thêm ghi chú!' }
								// {initialValue: (this.props.note !== undefined) ? this.props.note : null}]
							]
						})(
							<Input.TextArea
								placeholder="nhập ghi chú"
								autosize={{ minRows: 3, maxRows: 7 }}
							/>
						)}
					</Form.Item>
				</Form>
			</Modal>
		)
	}
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

const UPDATE_ORDER = gql`
	mutation updateOrder($id: String!, $input: UpdateOrderInput!) {
		updateOrder(id: $id, input: $input)
	}
`

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

const Order = props => {
	const [dishes, setDishes] = useState()
	const [menuId, setMenuId] = useState()
	const [orderedNumber, setOrderedNumber] = useState({})
	const [isPublish, setIsPublish] = useState()
	const [isLocked, setIsLocked] = useState()
	const [alert, setAlert] = useState(false)
	const [ordersCountByUser, setOrdersCountByUser] = useState({})
	const [modalVisible, setModalVisible] = useState(false)
	const [selectedItem, setSelectedItem] = useState()
	const [orderId, setOrderId] = useState()
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
					await data.data.ordersByMenuCreated.map(order =>
						obj[order.dishId]
							? // eslint-disable-next-line operator-assignment
							  (obj[order.dishId] = obj[order.dishId] + order.count)
							: (obj[order.dishId] = order.count)
					)
					console.log(obj)
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
		handleOrdersByMenu()
		handleOrdersCountByUser()
	}, [])

	function showModal(item) {
		setModalVisible(true)
		setSelectedItem(item)
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
				}
			})
			.then(async res => {
				await setOrderId(res.data.orderDish)
				if (res.data.orderDish) {
					console.log('Đặt thành công')
					await handleOrderedNumber()
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
			console.log(menuId)
			console.log(selectedItem._id)

			await props.client
				.mutate({
					mutation: UPDATE_ORDER,
					variables: {
						id: orderId,
						input: {
							menuId,
							dishId: selectedItem._id,
							note: values.note,
							count: 0
						}
					}
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
			await setOrdersCountByUser({
				...ordersCountByUser,
				[item._id]: ordersCountByUser[item._id] - 1
			})
		} else {
			await setOrdersCountByUser({
				...ordersCountByUser,
				[item._id]: (ordersCountByUser[item._id] = 0)
			})
		}
		await createOrder(item, ordersCountByUser[item._id] - 1)
	}

	async function handlePlus(item) {
		if (
			ordersCountByUser[item._id] !== undefined &&
			ordersCountByUser[item._id] < item.count
		) {
			console.log('khong undefined va < count')
			await setOrdersCountByUser({
				...ordersCountByUser,
				[item._id]: ordersCountByUser[item._id] + 1
			})
			// eslint-disable-next-line no-cond-assign
		} else {
			console.log('con lai')
			await setOrdersCountByUser({
				...ordersCountByUser,
				[item._id]: 1
			})
		}
		await createOrder(item, ordersCountByUser[item._id] + 1)
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
						if (res) {
							setAlert(true)
						} else {
							console.log('something went wrong')
						}
					})
					.catch(error => {
						console.dir(error)
					})
			})
	}

	// eslint-disable-next-line no-unused-vars
	function saveFormRef(formRef) {
		formRef = formRef
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
	const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(NoteForm)
	return (
		<React.Fragment>
			<div
				style={{
					backgroundColor: '#eee',
					paddingBottom: 40,
					overflow: 'hidden'
				}}
			>
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
									bordered
									size="large"
									dataSource={dishes}
									renderItem={item => (
										<List.Item
											key={item._id}
											actions={[
												<Button
													id={`minus-order-${item._id}`}
													className="minus-order"
													disabled={
														ordersCountByUser[item._id] === 0 ||
														ordersCountByUser[item._id] === undefined ||
														isLocked
													}
													onClick={() => handleMinus(item)}
												>
													-
												</Button>,
												<Button
													id={`plus-order-${item._id}`}
													className="plus-order"
													disabled={
														ordersCountByUser[item._id] === item.count ||
														isLocked
													}
													onClick={() => handlePlus(item)}
												>
													+
												</Button>
											]}
											extra={
												<Button
													type="primary"
													onClick={() => showModal(item)}
													id={`note-order-${item._id}`}
												>
													Note
												</Button>
											}
										>
											<List.Item.Meta
												title={item.name}
												description={`${(orderedNumber &&
													orderedNumber[item._id]) ||
													0}/${item.count}`}
											/>
											<div>
												{(ordersCountByUser && ordersCountByUser[item._id]) || 0}
											</div>
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
				<CollectionCreateForm
					wrappedComponentRef={saveFormRef}
					visible={modalVisible}
					onCancel={handleCancel}
					onCreate={handleNote}
					// eslint-disable-next-line no-return-assign
					refForm={ref => (formRef = ref)}
				/>
			</div>
		</React.Fragment>
	)
}

export default withApollo(Order)
