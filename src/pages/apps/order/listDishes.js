import React, { useState, useEffect } from 'react'
import { Button, List, Row } from 'antd'
import gql from 'graphql-tag'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'

const ListDishes = props => {
	// eslint-disable-next-line react/destructuring-assignment
	const [dishes, setDishes] = useState(props.dishes)
	// const [menuId, setMenuId] = useState()
	const [, setOrderNumber] = useState()
	// const [isPublish, setIsPublish] = useState(props)

	useEffect(() => {
		if (props.isPublished === true && props.isActive === true) {
			// eslint-disable-next-line no-use-before-define
			handleDefaultDishes()
		}
	}, [])

	async function handleDefaultDishes() {
		// setDishes([...props.data.menuPublishBySite.dishes])
		const orderNumbers = props.ordersByMenu.ordersByMenu
			? props.ordersByMenu.ordersByMenu.map(order => order.count)
			: { '0': 1, '1': 2, '2': 3, '3': 4, '4': 5 }
		console.log(orderNumbers)

		if (props.isPublished === true && props.isActive === true) {
			// setMenuId(props.data.menuPublishBySite._id)
			// eslint-disable-next-line no-return-assign
			setOrderNumber(
				[...props.dishes].map(
					// eslint-disable-next-line no-return-assign
					(dish, index) =>
						// eslint-disable-next-line no-param-reassign
						(dish.orderNumber = orderNumbers[index])
				)
			)
			// setDishes([...props.data.menuPublishBySite.dishes])
		}
		if (props.data.error) {
			console.log(props.data.error)
		}
	}

	async function createOrder(item) {
		await props.mutate
			.orderDish({
				variables: {
					input: {
						menuId: props.menuId,
						dishId: item._id,
						count: item.orderNumber
					}
				}
			})
			.then(res => {
				// eslint-disable-next-line no-unused-expressions
				res ? console.log('success') : console.log('something went wrong')
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
		setDishes(theDish)
		await createOrder(item)
	}

	async function unselectDishHandler(index, item) {
		const theDish = [...dishes]
		// eslint-disable-next-line no-return-assign
		await dishes.map(dish =>
			dish._id === item._id && dish.orderNumber > 0
				? (theDish[index] = {
						...theDish[index],
						orderNumber: item.orderNumber - 1
				  })
				: (theDish[index] = { ...theDish[index], orderNumber: item.orderNumber })
		)

		setDishes(theDish)
		await createOrder(item)
	}

	async function handleMinus(item) {
		const index = dishes.map(() => '-').indexOf(item._id)
		await unselectDishHandler(index, item)
	}

	async function handlePlus(item) {
		const index = dishes.map(() => '+').indexOf(item._id)
		await selectDishHandler(index, item)
	}

	async function handleConfirmOrder() {
		console.log(props.menuId, props.ordersByUser.ordersByUser)
		props.ordersByUser.ordersByUser.map(dish =>
			dish.count !== 0
				? props.mutate
						.confirmOrder({
							variables: {
								menuId: props.menuId,
								dishId: dish._id
							}
						})
						.then(res => {
							// eslint-disable-next-line no-unused-expressions
							res
								? // eslint-disable-next-line no-undef
								  alert('Xác nhận thành công')
								: // ? <Alert message="Success Text" type="success" />
								  console.log('something went wrong')
						})
						.catch(error => {
							console.dir(error)
						})
				: null
		)
	}

	const time = new Date(Date.now()).getHours()
	const confirmButton =
		time >= 12 && time < 18 ? (
			<Button
				onClick={handleConfirmOrder}
				style={{ display: 'block', textAlign: 'center' }}
			>
				Xác nhận
			</Button>
		) : null
	return (
		<React.Fragment>
			{// eslint-disable-next-line react/destructuring-assignment
			props.isPublished === true ? (
				<>
					<List
						dataSource={dishes}
						renderItem={item => (
							<List.Item
								key={item._id}
								actions={[
									<Button
										className="minus"
										disabled={props.isLocked}
										onClick={() => handleMinus(item)}
									>
										-
									</Button>,
									<Button
										className="plus"
										disabled={props.isLocked}
										onClick={() => handlePlus(item)}
									>
										+
									</Button>
								]}
							>
								<List.Item.Meta
									title={item.name}
									description={
										`${item.orderNumber}` === 'undefined'
											? `${0}/${item.count}`
											: `${item.orderNumber}/${item.count}`
									}
								/>
								<div>{item.orderNumber}</div>
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
	mutation confirmOrder($menuId: String!, $dishId: String!) {
		confirmOrder(menuId: $menuId, dishId: $dishId)
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

export default HOCQueryMutation([
	{
		query: ORDERS_BY_MENU,
		options: props => {
			// console.log(props.menuId)
			return {
				variables: {
					// menuId: '3f423520-a214-11e9-83ee-5f5fb731ebb3'
					menuId: props.menuId
				},
				skip: !props.menuId,
				fetchPolicy: 'network-only'
			}
		},
		name: 'ordersByMenu'
	},
	{
		query: ORDERS_BY_USER,
		options: props => {
			// console.log(props.menuId)
			return {
				variables: {
					// menuId: '3f423520-a214-11e9-83ee-5f5fb731ebb3'
					menuId: props.menuId
				},
				skip: !props.menuId,
				fetchPolicy: 'network-only'
			}
		},
		name: 'ordersByUser'
	},
	{
		query: MENU_BY_SELECTED_SITE,
		options: props => ({
			variables: {
				siteId: props.siteId
			},
			fetchPolicy: 'network-only'
		})
	},
	{
		mutation: ORDER_DISH,
		name: 'orderDish',
		options: {}
	},
	{
		mutation: CONFIRM_ORDER,
		name: 'confirmOrder',
		options: {}
	}
])(ListDishes)
